#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync, readdirSync, statSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const docsDir = join(rootDir, 'docs', 'architecture', 'generated');

// Ensure generated docs directory exists
if (!existsSync(docsDir)) {
  mkdirSync(docsDir, { recursive: true });
}

// Disable Jekyll for GitHub Pages
writeFileSync(join(docsDir, '.nojekyll'), '');

console.log('🏗️  Generating architecture documentation...\n');

// 1. Module Dependency Graph with circular dependency detection
console.log('📊 Generating module dependency graph...');
try {
  // Check for circular dependencies - madge returns paths if circular deps exist
  const circularCheck = execSync(
    'npx madge --circular --extensions ts,tsx,astro,jsx,js --exclude "node_modules|.astro" --json src/',
    {
      cwd: rootDir,
      encoding: 'utf-8',
    }
  );

  const circularDeps = JSON.parse(circularCheck);
  if (Object.keys(circularDeps).length > 0) {
    console.log('  ⚠️  Warning: Circular dependencies detected!');
    writeFileSync(
      join(docsDir, 'circular-dependencies.json'),
      JSON.stringify(circularDeps, null, 2)
    );
  }

  // Generate Graphviz DOT file and Mermaid diagram
  try {
    const dotOutput = execSync(
      'npx madge --extensions ts,tsx,astro,jsx,js --exclude "node_modules|.astro" --dot src/',
      {
        cwd: rootDir,
        encoding: 'utf-8',
      }
    );
    writeFileSync(join(docsDir, 'dependencies.dot'), dotOutput);

    // Convert to Mermaid format
    const mermaidGraph = convertDotToMermaid(dotOutput);
    writeFileSync(join(docsDir, 'module-dependencies.mmd'), mermaidGraph);

    console.log('  ✓ Module dependency graph generated');
  } catch (dotError) {
    console.log('  ⚠️  Skipping DOT graph generation (graphviz may not be available)');
  }
} catch (error) {
  console.error('  ✗ Failed to generate dependency graph:', error.message);
}

// 2. Bundle Analysis (will be generated during build)
console.log('📦 Setting up bundle analysis...');
try {
  // Create a build config that includes the visualizer
  const visualizerConfig = `
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({
      filename: './docs/architecture/bundle-stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap'
    })
  ]
};
`;
  writeFileSync(join(rootDir, 'rollup.config.js'), visualizerConfig);
  console.log('  ✓ Bundle analysis configured (run npm build to generate)');
} catch (error) {
  console.error('  ✗ Failed to setup bundle analysis:', error.message);
}

// 3. Routes Map
console.log('🗺️  Generating routes map...');
try {
  const pagesDir = join(rootDir, 'src', 'pages');

  // Recursively find all .astro and .md files
  function findRouteFiles(dir, baseDir = dir) {
    let files = [];
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(findRouteFiles(fullPath, baseDir));
      } else if (entry.name.endsWith('.astro') || entry.name.endsWith('.md')) {
        files.push(fullPath.replace(/\\/g, '/').replace(baseDir.replace(/\\/g, '/') + '/', ''));
      }
    }
    return files;
  }

  const routeFiles = findRouteFiles(pagesDir);

  const routes = routeFiles.map((route) => {
    const path = route
      .replace(/^/, '/')
      .replace('/index.astro', '/')
      .replace('.astro', '')
      .replace('.md', '');
    return { file: `src/pages/${route}`, path };
  });

  const routesMermaid = generateRoutesMermaid(routes);
  writeFileSync(join(docsDir, 'routes-map.mmd'), routesMermaid);

  const routesJson = JSON.stringify(routes, null, 2);
  writeFileSync(join(docsDir, 'routes.json'), routesJson);

  console.log(`  ✓ Routes map generated (${routes.length} routes)`);
} catch (error) {
  console.error('  ✗ Failed to generate routes map:', error.message);
}

// 4. Parse project configuration
console.log('⚙️  Parsing project configuration...');
const projectConfig = parseProjectConfig();

// 5. Analyze component structure
console.log('🔍 Analyzing component structure...');
const componentStructure = analyzeComponentStructure();

// 6. Analyze code structure with AST
console.log('🔬 Analyzing code structure...');
const codeStructure = analyzeCodeStructure();

// 7. C4 System Diagrams
console.log('🏛️  Generating C4 system diagrams...');
try {
  const c4Diagram = generateC4SystemDiagram(projectConfig);
  writeFileSync(join(docsDir, 'c4-system-context.puml'), c4Diagram);

  const c4Container = generateC4ContainerDiagram(projectConfig);
  writeFileSync(join(docsDir, 'c4-container.puml'), c4Container);

  const c4Component = generateC4ComponentDiagram(componentStructure, projectConfig);
  writeFileSync(join(docsDir, 'c4-component.puml'), c4Component);

  // Level 4 (Code) diagrams intentionally skipped - they quickly become overwhelming
  // at scale. Generate them manually for critical components when needed.
  // const c4Code = generateC4CodeDiagram(codeStructure, projectConfig);
  // writeFileSync(join(docsDir, 'c4-code.puml'), c4Code);

  console.log('  ✓ C4 diagrams generated (Levels 1-3)');
} catch (error) {
  console.error('  ✗ Failed to generate C4 diagrams:', error.message);
}

console.log('\n✨ Architecture documentation generated successfully!');
console.log(`📁 Output directory: ${docsDir}\n`);

// Helper functions

function parseProjectConfig() {
  const config = {
    name: 'ChrisLyons.dev',
    site: '',
    hosting: 'Cloudflare Pages',
    repository: 'GitHub',
    dependencies: {},
    integrations: [],
    buildTool: 'Vite',
    framework: 'Astro',
    cicd: {
      platform: 'GitHub Actions',
      workflows: [],
      deployTarget: '',
      buildCommand: '',
      outputDir: '',
      triggers: [],
    },
  };

  // Parse package.json
  try {
    const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8'));
    config.name = packageJson.name || config.name;
    config.dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };
  } catch (error) {
    console.log('  ⚠️  Could not parse package.json');
  }

  // Parse astro.config.mjs
  try {
    const astroConfig = readFileSync(join(rootDir, 'astro.config.mjs'), 'utf-8');

    // Extract site URL
    const siteMatch = astroConfig.match(/site:\s*['"]([^'"]+)['"]/);
    if (siteMatch) {
      config.site = siteMatch[1];
    }

    // Extract integrations
    const integrationMatches = astroConfig.matchAll(
      /import\s+(\w+)\s+from\s+['"]@astrojs\/([^'"]+)['"]/g
    );
    for (const match of integrationMatches) {
      config.integrations.push(match[2]);
    }
  } catch (error) {
    console.log('  ⚠️  Could not parse astro.config.mjs');
  }

  // Parse wrangler.toml
  try {
    const wranglerToml = readFileSync(join(rootDir, 'wrangler.toml'), 'utf-8');

    // Confirm Cloudflare hosting
    if (wranglerToml.includes('pages_build_output_dir') || wranglerToml.includes('[site]')) {
      config.hosting = 'Cloudflare Pages';
    }
  } catch (error) {
    console.log('  ⚠️  Could not parse wrangler.toml');
  }

  // Parse GitHub Actions CD workflow (Infrastructure as Code!)
  try {
    const cdWorkflow = readFileSync(join(rootDir, '.github/workflows/cd.yml'), 'utf-8');

    // Extract workflow name
    const nameMatch = cdWorkflow.match(/^name:\s*(.+)$/m);
    if (nameMatch) {
      config.cicd.workflows.push(nameMatch[1]);
    }

    // Extract triggers
    const onMatch = cdWorkflow.match(/^on:\s*\n([\s\S]*?)^\w+:/m);
    if (onMatch) {
      if (cdWorkflow.includes('workflow_run:')) config.cicd.triggers.push('CI completion');
      if (cdWorkflow.includes('workflow_dispatch')) config.cicd.triggers.push('manual trigger');
      if (cdWorkflow.includes('push:')) config.cicd.triggers.push('push to main');
    }

    // Extract deployment target from cloudflare/pages-action
    const cloudflareAction = cdWorkflow.match(/uses:\s*cloudflare\/pages-action@/);
    if (cloudflareAction) {
      config.cicd.deployTarget = 'Cloudflare Pages';

      // Extract project name
      const projectMatch = cdWorkflow.match(/projectName:\s*(.+)$/m);
      if (projectMatch) {
        config.cicd.projectName = projectMatch[1];
      }

      // Extract output directory
      const dirMatch = cdWorkflow.match(/directory:\s*(.+)$/m);
      if (dirMatch) {
        config.cicd.outputDir = dirMatch[1];
      }
    }

    // Extract build command
    const buildMatch = cdWorkflow.match(/run:\s*npm run build/);
    if (buildMatch) {
      config.cicd.buildCommand = 'npm run build';
    }

    // Extract environment
    const envMatch = cdWorkflow.match(/environment:\s*\n\s*name:\s*(.+)$/m);
    if (envMatch) {
      config.cicd.environment = envMatch[1];
    }

    console.log(`  ✓ Parsed CD workflow: deploys to ${config.cicd.deployTarget || 'unknown'}`);
  } catch (error) {
    console.log('  ⚠️  Could not parse cd.yml');
  }

  // Parse CI workflow for additional services
  try {
    const ciWorkflow = readFileSync(join(rootDir, '.github/workflows/ci.yml'), 'utf-8');

    // Detect Lighthouse CI
    if (ciWorkflow.includes('lighthouse') || ciWorkflow.includes('lhci')) {
      config.cicd.hasLighthouse = true;
    }

    // Detect testing
    if (ciWorkflow.match(/run:\s*npm\s+test/)) {
      config.cicd.hasTests = true;
    }

    // Detect build verification
    if (ciWorkflow.match(/run:\s*npm\s+run\s+build/)) {
      config.cicd.hasBuildVerification = true;
    }

    // Detect Pages deployment (GitHub or Cloudflare)
    if (ciWorkflow.includes('deploy-pages@') || ciWorkflow.includes('mkdocs build')) {
      config.cicd.hasDocsDeployment = true;
    }
  } catch (error) {
    console.log('  ⚠️  Could not parse ci.yml');
  }

  console.log(`  ✓ Parsed configuration: ${config.name} (${config.site})`);
  return config;
}

function analyzeComponentStructure() {
  const srcDir = join(rootDir, 'src');
  const structure = {
    pages: [],
    components: [],
    layouts: [],
    services: [],
    utils: [],
    data: [],
  };

  function scanDirectory(dir, category) {
    if (!existsSync(dir)) return;

    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDirectory(fullPath, category);
      } else if (entry.name.match(/\.(tsx?|astro|jsx?)$/)) {
        const relativePath = fullPath.replace(srcDir + '/', '').replace(/\\/g, '/');
        structure[category].push({
          name: entry.name.replace(/\.(tsx?|astro|jsx?)$/, ''),
          file: relativePath,
          type: entry.name.split('.').pop(),
        });
      }
    }
  }

  // Scan known directories
  scanDirectory(join(srcDir, 'pages'), 'pages');
  scanDirectory(join(srcDir, 'components'), 'components');
  scanDirectory(join(srcDir, 'layouts'), 'layouts');
  scanDirectory(join(srcDir, 'services'), 'services');
  scanDirectory(join(srcDir, 'utils'), 'utils');
  scanDirectory(join(srcDir, 'data'), 'data');

  console.log(
    `  ✓ Found ${structure.pages.length} pages, ${structure.components.length} components, ${structure.services.length} services`
  );
  return structure;
}

function analyzeCodeStructure() {
  const srcDir = join(rootDir, 'src');
  const structure = {
    classes: [],
    functions: [],
    interfaces: [],
    exports: [],
  };

  // Focus on a key service file for detailed analysis
  const themeManagerPath = join(srcDir, 'services', 'ThemeManager.ts');

  if (existsSync(themeManagerPath)) {
    try {
      const code = readFileSync(themeManagerPath, 'utf-8');

      // Use regex to extract TypeScript class information
      const classRegex = /(?:export\s+)?class\s+(\w+)/g;
      const methodRegex = /^\s*(?:public|private|protected)?\s*(\w+)\s*\([^)]*\)\s*[:{\s]/gm;
      const interfaceRegex = /interface\s+(\w+)/g;

      // Extract classes
      let classMatch;
      while ((classMatch = classRegex.exec(code)) !== null) {
        const className = classMatch[1];

        // Extract methods for this class (simplified - gets all methods in file)
        const methods = [];
        let methodMatch;
        const methodPattern = new RegExp(
          `class\\s+${className}[\\s\\S]*?\\{([\\s\\S]*?)\\n\\}`,
          'm'
        );
        const classBody = code.match(methodPattern);

        if (classBody) {
          const bodyMethodRegex =
            /^\s*(?:public|private|protected)?\s*(?:async\s+)?(\w+)\s*\([^)]*\)\s*[:{\s]/gm;
          let m;
          while ((m = bodyMethodRegex.exec(classBody[1])) !== null) {
            const methodName = m[1];
            // Filter out control flow keywords and only include valid method names
            if (
              methodName !== 'constructor' &&
              !methodName.startsWith('_') &&
              !['if', 'for', 'while', 'switch', 'catch', 'return'].includes(methodName)
            ) {
              methods.push(methodName);
            }
          }
        }

        structure.classes.push({
          name: className,
          methods: methods,
          file: 'services/ThemeManager.ts',
        });
      }

      // Extract interfaces
      let interfaceMatch;
      while ((interfaceMatch = interfaceRegex.exec(code)) !== null) {
        structure.interfaces.push(interfaceMatch[1]);
      }
    } catch (error) {
      console.log(`  ⚠️  Could not read ThemeManager.ts: ${error.message}`);
    }
  }

  console.log(
    `  ✓ Analyzed ${structure.classes.length} classes, ${structure.interfaces.length} interfaces`
  );
  return structure;
}

function convertDotToMermaid(dotOutput) {
  // Basic DOT to Mermaid conversion
  const lines = dotOutput
    .split('\n')
    .filter((line) => line.includes('->'))
    .map((line) => {
      const match = line.match(/"([^"]+)"\s*->\s*"([^"]+)"/);
      if (match) {
        const from = match[1].replace(/[\/\.\-]/g, '_');
        const to = match[2].replace(/[\/\.\-]/g, '_');
        return `  ${from}[${match[1]}] --> ${to}[${match[2]}]`;
      }
      return '';
    })
    .filter(Boolean)
    .join('\n');

  return `graph LR
  %% Module Dependencies
  %% Generated from madge analysis

${lines}
`;
}

function generateRoutesMermaid(routes) {
  const routeLines = routes
    .map((route) => {
      const id =
        route.path === '/'
          ? 'route_index'
          : route.path.replace(/[\/\-]/g, '_').replace(/^_/, 'route_');
      return `  Pages --> ${id}["${route.path}"]`;
    })
    .join('\n');

  return `graph TD
  %% Application Routes
  Root["/"] --> Pages

${routeLines}

  style Root fill:#2563EB,color:#fff
  style Pages fill:#7C3AED,color:#fff
`;
}

function generateC4SystemDiagram(config) {
  const siteName = config.site || 'ChrisLyons.dev';
  const hosting = config.cicd?.deployTarget || config.hosting || 'Cloudflare Pages';
  const cicdPlatform = config.cicd?.platform || 'GitHub Actions';

  // Build CI/CD description from parsed workflow
  let cicdDescription = 'Source code repository';
  if (config.cicd?.workflows?.length > 0) {
    cicdDescription += ` with ${config.cicd.workflows.join(', ')} workflows`;
  }
  if (config.cicd?.triggers?.length > 0) {
    cicdDescription += `. Triggers: ${config.cicd.triggers.join(', ')}`;
  }

  // Build deployment relationship description
  let deploymentFlow = 'Deploys via';
  if (config.cicd?.buildCommand) {
    deploymentFlow += ` ${config.cicd.buildCommand}`;
  }
  if (config.cicd?.outputDir) {
    deploymentFlow += ` → ${config.cicd.outputDir}`;
  }

  // Build CI pipeline services from detected features
  let ciServices = '';
  let ciRelationships = '';

  if (config.cicd?.hasLighthouse) {
    ciServices += 'System_Ext(lighthouse, "Lighthouse CI", "Performance testing and monitoring")\n';
    ciRelationships += 'Rel(github, lighthouse, "Runs performance tests", "CI Pipeline")\n';
    ciRelationships += 'Rel(lighthouse, cloudflare, "Uploads reports to", "Google Storage")\n';
  }

  if (config.cicd?.hasDocsDeployment) {
    ciServices += 'System_Ext(github_pages, "GitHub Pages", "Documentation hosting")\n';
    ciRelationships += 'Rel(github, github_pages, "Deploys docs to", "GitHub Actions")\n';
  }

  return `@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

LAYOUT_WITH_LEGEND()

title System Context diagram for ${siteName}
note as DeploymentNote
  **Infrastructure as Code (parsed from workflows):**
  Platform: ${cicdPlatform}
  Target: ${hosting}
  ${config.cicd?.environment ? `Environment: ${config.cicd.environment}` : ''}
  ${config.cicd?.projectName ? `Project: ${config.cicd.projectName}` : ''}
  ${config.cicd?.hasLighthouse ? '✓ Lighthouse CI enabled' : ''}
  ${config.cicd?.hasTests ? '✓ Automated testing' : ''}
  ${config.cicd?.hasBuildVerification ? '✓ Build verification' : ''}
end note

Person(user, "Visitor", "A person visiting the portfolio website")

System(website, "${siteName}", "Static portfolio website built with ${config.framework}, showcasing projects, architecture examples, and professional experience")

System_Ext(cloudflare, "${hosting}", "Hosts the static website with global CDN and edge network")
System_Ext(analytics, "Cloudflare Analytics", "Privacy-focused web analytics and Core Web Vitals monitoring")
System_Ext(github, "${config.repository}", "${cicdDescription}")
${ciServices}

Rel(user, website, "Views content", "HTTPS")
Rel(website, cloudflare, "Deployed to", "HTTPS")
Rel(website, analytics, "Sends metrics", "HTTPS")
Rel(github, cloudflare, "${deploymentFlow}", "${cicdPlatform}")
${ciRelationships}

SHOW_LEGEND()

@enduml`;
}

function generateC4ContainerDiagram(config) {
  const siteName = config.site || 'ChrisLyons.dev';
  const hosting = config.hosting || 'Cloudflare Pages';

  // Detect key technologies from dependencies
  const hasReact = config.dependencies?.['react'] || config.dependencies?.['@astrojs/react'];
  const hasTailwind = config.dependencies?.['tailwindcss'];
  const hasMermaid = config.dependencies?.['mermaid'];
  const hasPlantUML = config.dependencies?.['plantuml-encoder'];

  let containers = `    Container(pages, "${config.framework} Pages", "${config.framework} SSG", "Pre-rendered static pages and content, built with ${config.buildTool}")`;

  if (hasReact) {
    containers += `\n    Container(components, "React Components", "React/TypeScript", "Interactive UI components with client-side hydration")`;
  }

  if (hasMermaid || hasPlantUML) {
    const diagramTools = [hasMermaid && 'Mermaid', hasPlantUML && 'PlantUML']
      .filter(Boolean)
      .join('/');
    containers += `\n    Container(diagrams, "Architecture Diagrams", "${diagramTools}", "Auto-generated technical documentation and visualizations")`;
  }

  if (hasTailwind) {
    containers += `\n    Container(assets, "Static Assets", "Tailwind CSS/Images/Fonts", "Optimized styling and media with CSS-in-JS")`;
  } else {
    containers += `\n    Container(assets, "Static Assets", "CSS/Images/Fonts", "Styling and media files")`;
  }

  return `@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

LAYOUT_WITH_LEGEND()

title Container diagram for ${siteName}

Person(user, "Visitor", "A person visiting the portfolio website")

System_Boundary(website, "${siteName}") {
${containers}
}

System_Ext(cloudflare, "${hosting}", "Static hosting with global edge network and automatic HTTPS")
System_Ext(analytics, "Cloudflare Analytics", "Privacy-focused web analytics and Core Web Vitals monitoring")

Rel(user, cloudflare, "Requests pages", "HTTPS")
Rel(cloudflare, pages, "Serves", "HTTP/2")
${hasReact ? 'Rel(pages, components, "Hydrates", "JavaScript")\n' : ''}${hasMermaid || hasPlantUML ? 'Rel(pages, diagrams, "Includes", "SVG/PNG")\n' : ''}Rel(pages, assets, "References", "")
Rel(cloudflare, analytics, "Sends metrics", "HTTPS")

SHOW_LEGEND()

@enduml`;
}

function generateC4ComponentDiagram(structure, config) {
  const siteName = config.site || 'ChrisLyons.dev';

  // Generate component definitions
  let components = '';

  // Pages
  if (structure.pages.length > 0) {
    components += `    Component(pages_handler, "Pages Handler", "${config.framework}", "Routes and page rendering")\n`;
    structure.pages.slice(0, 5).forEach((page) => {
      const id = page.name.replace(/[^a-zA-Z0-9]/g, '_');
      components += `    Component(page_${id}, "${page.name}", "${page.type}", "Page: ${page.file}")\n`;
    });
    if (structure.pages.length > 5) {
      components += `    Component(page_more, "... ${structure.pages.length - 5} more pages", "", "")\n`;
    }
  }

  // Components
  if (structure.components.length > 0) {
    components += `    Component(component_registry, "Component Registry", "React/Astro", "UI component library")\n`;
    structure.components.forEach((comp) => {
      const id = comp.name.replace(/[^a-zA-Z0-9]/g, '_');
      components += `    Component(comp_${id}, "${comp.name}", "${comp.type}", "${comp.file}")\n`;
    });
  }

  // Services
  if (structure.services.length > 0) {
    components += `    Component(service_layer, "Service Layer", "TypeScript", "Business logic and state management")\n`;
    structure.services.forEach((svc) => {
      const id = svc.name.replace(/[^a-zA-Z0-9]/g, '_');
      components += `    Component(svc_${id}, "${svc.name}", "${svc.type}", "${svc.file}")\n`;
    });
  }

  // Utils
  if (structure.utils.length > 0) {
    components += `    Component(utils, "Utilities", "TypeScript", "Helper functions and shared logic")\n`;
  }

  // Data
  if (structure.data.length > 0) {
    components += `    Component(data_layer, "Data Layer", "TypeScript", "Static data and content")\n`;
  }

  // Generate relationships
  let relationships = '';
  relationships += 'Rel(pages_handler, component_registry, "Uses")\n';

  if (structure.services.length > 0) {
    relationships += 'Rel(component_registry, service_layer, "Calls")\n';
  }

  if (structure.utils.length > 0) {
    relationships += 'Rel(service_layer, utils, "Uses")\n';
    relationships += 'Rel(component_registry, utils, "Uses")\n';
  }

  if (structure.data.length > 0) {
    relationships += 'Rel(pages_handler, data_layer, "Reads")\n';
  }

  return `@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

LAYOUT_WITH_LEGEND()

title Component diagram for ${siteName}

Container_Boundary(app, "${config.framework} Application") {
${components}}

${relationships}
SHOW_LEGEND()

@enduml`;
}

function generateC4CodeDiagram(structure, config) {
  const siteName = config.site || 'ChrisLyons.dev';

  // Generate class and method definitions
  let code = '';

  if (structure.classes.length > 0) {
    structure.classes.forEach((cls) => {
      code += `    class ${cls.name} {\n`;

      cls.methods.forEach((method) => {
        code += `      +${method}()\n`;
      });

      code += `    }\n\n`;
    });
  }

  if (structure.functions.length > 0) {
    structure.functions.forEach((func) => {
      const params = func.params.join(', ');
      code += `    note "function ${func.name}(${params})" as ${func.name}_note\n`;
    });
  }

  // Generate relationships example
  let relationships = '';
  if (structure.classes.length > 0) {
    relationships = `
    note right of ${structure.classes[0].name}
      Auto-generated from AST analysis
      of services/ThemeManager.ts
    end note`;
  }

  return `@startuml

title Code Level diagram - ThemeManager Service Example

${code || 'note "Code analysis in progress" as N1'}

${relationships}

@enduml`;
}
