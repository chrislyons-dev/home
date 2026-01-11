/**
 * @module generate-diagram-images
 * @description Generates static SVG images from Mermaid (.mmd) and PlantUML (.puml)
 * diagram source files at build time. Runs automatically before dev/build via npm scripts.
 *
 * @requires @mermaid-js/mermaid-cli - Mermaid CLI (installed via npx)
 * @requires plantuml-encoder - Encodes PlantUML for web service
 * @requires curl - Downloads PlantUML SVGs from plantuml.com
 *
 * Outputs: public/architecture/*.svg (gitignored, generated at build time)
 * Sources: docs/architecture/examples/*.{mmd,puml} (version controlled)
 *
 * External dependencies:
 * - plantuml.com web service for PlantUML rendering (build-time only)
 * - Falls back gracefully if service is unavailable
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, '..', 'docs', 'architecture', 'examples');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'architecture');
const MERMAID_CONFIG = path.join(__dirname, '..', 'config', 'mermaid-config.json');
const MERMAID_CLI_VERSION = '@mermaid-js/mermaid-cli@11.4.0';

/**
 * Validates that a file path is safe and within expected directory
 * @param {string} filePath - Path to validate
 * @param {string} baseDir - Base directory the path should be within
 * @throws {Error} If path is invalid or outside base directory
 */
export function validatePath(filePath, baseDir) {
  const resolved = path.resolve(filePath);
  const base = path.resolve(baseDir);

  if (!resolved.startsWith(base)) {
    throw new Error(`Security: Path ${filePath} is outside allowed directory ${baseDir}`);
  }

  // Check for shell metacharacters in filename
  const filename = path.basename(filePath);
  if (/[;&|`$<>]/.test(filename)) {
    throw new Error(`Security: Filename contains invalid characters: ${filename}`);
  }
}

/**
 * Generate SVG images from Mermaid (.mmd) diagram files
 * @returns {Promise<number>} Number of diagrams generated
 */
export async function generateMermaidImages() {
  console.log(' Generating Mermaid diagram images...');

  const files = await fs.readdir(DOCS_DIR);
  const mmdFiles = files.filter((f) => f.endsWith('.mmd'));

  if (mmdFiles.length === 0) {
    console.log('  No .mmd files found in', DOCS_DIR);
    return 0;
  }

  let successCount = 0;

  for (let i = 0; i < mmdFiles.length; i++) {
    const file = mmdFiles[i];
    const inputPath = path.join(DOCS_DIR, file);
    const outputFile = file.replace('.mmd', '.svg');
    const outputPath = path.join(OUTPUT_DIR, outputFile);

    try {
      // Validate paths for security
      validatePath(inputPath, DOCS_DIR);
      validatePath(outputPath, OUTPUT_DIR);

      console.log(`  [${i + 1}/${mmdFiles.length}] Generating ${outputFile}...`);

      // Use spawnSync with array args for safer execution
      const args = [
        '-y',
        MERMAID_CLI_VERSION,
        '-i',
        inputPath,
        '-o',
        outputPath,
        '-b',
        'transparent',
        '-c',
        MERMAID_CONFIG,
      ];

      // Add Puppeteer args for CI environments (GitHub Actions, etc.)
      if (process.env.CI) {
        args.push('-p', 'puppeteer-config.json');
      }

      const result = spawnSync('npx', args, {
        stdio: ['ignore', 'pipe', 'pipe'],
        encoding: 'utf-8',
      });

      // Verify file was created and has content (mermaid-cli may exit non-zero with warnings)
      try {
        const stats = await fs.stat(outputPath);
        if (stats.size > 0) {
          console.log(`   Generated ${outputFile}`);
          successCount++;
        } else {
          console.error(`   Failed to generate ${outputFile} (empty file)`);
        }
      } catch (statError) {
        console.error(`   Failed to generate ${outputFile}`);
        if (result.stderr) {
          const errorMsg = result.stderr.substring(0, 300).trim();
          if (errorMsg) {
            console.error(`    ${errorMsg}`);
          }
        }
      }
    } catch (error) {
      console.error(`   Failed to generate ${outputFile}:`, error.message);
    }
  }

  return successCount;
}

/**
 * Fetch PlantUML SVG from web service with retry logic
 * @param {string} url - PlantUML service URL
 * @param {string} outputPath - Output file path
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<boolean>} Success status
 */
export async function fetchPlantUMLWithRetry(url, outputPath, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = spawnSync('curl', ['-s', '-f', url, '-o', outputPath], {
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      if (result.status === 0) {
        // Verify file was created and has content
        const stats = await fs.stat(outputPath);
        if (stats.size > 0) {
          return true;
        }
      }

      if (attempt < maxRetries - 1) {
        const delay = 1000 * Math.pow(2, attempt); // Exponential backoff
        console.log(`    Retry ${attempt + 1}/${maxRetries - 1} after ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;
      }
    }
  }

  return false;
}

/**
 * Sanitize SVG content by removing potentially dangerous elements
 * @param {string} svgContent - Raw SVG content
 * @returns {string} Sanitized SVG content
 */
export function sanitizeSVG(svgContent) {
  // Remove script tags
  let sanitized = svgContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers (onload, onclick, etc.)
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');

  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:[^"']*/gi, '');

  // Remove foreign objects (can contain HTML)
  sanitized = sanitized.replace(
    /<foreignObject\b[^<]*(?:(?!<\/foreignObject>)<[^<]*)*<\/foreignObject>/gi,
    ''
  );

  return sanitized;
}

/**
 * Try to use local PlantUML JAR if available, fall back to web service
 * @param {string} inputPath - Input .puml file path
 * @param {string} outputPath - Output .svg file path
 * @returns {Promise<boolean>} Success status
 */
async function tryLocalPlantUML(inputPath, outputPath) {
  // Check if plantuml.jar exists in project root or tools directory
  const jarPaths = [
    path.join(__dirname, '..', 'tools', 'plantuml.jar'),
    path.join(__dirname, '..', 'plantuml.jar'),
  ];

  for (const jarPath of jarPaths) {
    try {
      await fs.access(jarPath);
      // JAR exists, try to use it
      const result = spawnSync(
        'java',
        ['-jar', jarPath, '-tsvg', inputPath, '-o', path.dirname(outputPath)],
        {
          stdio: ['ignore', 'pipe', 'pipe'],
        }
      );

      if (result.status === 0) {
        const stats = await fs.stat(outputPath);
        if (stats.size > 0) {
          return true;
        }
      }
    } catch (error) {
      // JAR doesn't exist or failed, continue to next
      continue;
    }
  }

  return false;
}

/**
 * Generate SVG images from PlantUML (.puml) diagram files
 * @returns {Promise<number>} Number of diagrams generated
 */
export async function generatePlantUMLImages() {
  console.log('  Generating PlantUML diagram images...');

  const files = await fs.readdir(DOCS_DIR);
  const pumlFiles = files.filter((f) => f.endsWith('.puml'));

  if (pumlFiles.length === 0) {
    console.log('  No .puml files found in', DOCS_DIR);
    return 0;
  }

  let successCount = 0;
  let useLocalJar = false;

  // Check if local PlantUML JAR is available (more secure)
  const jarPath = path.join(__dirname, '..', 'tools', 'plantuml.jar');
  try {
    await fs.access(jarPath);
    useLocalJar = true;
    console.log('    Using local PlantUML JAR (secure mode)');
  } catch {
    console.log('    Using remote PlantUML service (consider downloading plantuml.jar)');
  }

  for (let i = 0; i < pumlFiles.length; i++) {
    const file = pumlFiles[i];
    const inputPath = path.join(DOCS_DIR, file);
    const outputFile = file.replace('.puml', '.svg');
    const outputPath = path.join(OUTPUT_DIR, outputFile);

    try {
      // Validate paths for security
      validatePath(inputPath, DOCS_DIR);
      validatePath(outputPath, OUTPUT_DIR);

      console.log(`  [${i + 1}/${pumlFiles.length}] Generating ${outputFile}...`);

      let success = false;

      // Try local JAR first (more secure)
      if (useLocalJar) {
        success = await tryLocalPlantUML(inputPath, outputPath);
      }

      // Fall back to web service if local JAR not available or failed
      if (!success) {
        // Import plantuml-encoder
        const { encode } = await import('plantuml-encoder');

        // Read PlantUML source
        const pumlSource = await fs.readFile(inputPath, 'utf-8');

        // Encode for PlantUML server
        const encoded = encode(pumlSource);

        // Try alternative public PlantUML server (Kroki) to avoid v1.2026.0 text bug
        // Fallback to plantuml.com if Kroki is unavailable
        const servers = [
          `https://kroki.io/plantuml/svg/${encoded}`,
          `https://www.plantuml.com/plantuml/svg/${encoded}`,
        ];

        // Download SVG from PlantUML server with retry, trying each server
        for (const url of servers) {
          success = await fetchPlantUMLWithRetry(url, outputPath, 2);
          if (success) break;
        }
      }

      // Sanitize SVG output to remove potential XSS vectors
      if (success) {
        const svgContent = await fs.readFile(outputPath, 'utf-8');
        const sanitized = sanitizeSVG(svgContent);
        await fs.writeFile(outputPath, sanitized, 'utf-8');

        console.log(`   Generated ${outputFile} (sanitized)`);
        successCount++;
      } else {
        console.error(`   Failed to generate ${outputFile} from all sources`);
      }
    } catch (error) {
      console.error(`   Failed to generate ${outputFile}:`, error.message);
    }
  }

  return successCount;
}

export async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const mermaidCount = await generateMermaidImages();
  const pumlCount = await generatePlantUMLImages();

  console.log(`Generated ${mermaidCount + pumlCount} total diagrams`);
}

const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
const isMain = entryPath === fileURLToPath(import.meta.url);

if (isMain) {
  await main();
}
