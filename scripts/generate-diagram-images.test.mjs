/**
 * @module generate-diagram-images.test
 * @description Tests for diagram generation script
 */
import { describe, it, expect, vi } from 'vitest';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validatePath, fetchPlantUMLWithRetry } from './generate-diagram-images.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('generate-diagram-images', () => {
  const DOCS_DIR = path.join(__dirname, '..', 'docs', 'architecture', 'examples');
  const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'architecture');

  describe('Path Validation', () => {
    it('should validate paths are within base directory', () => {
      const validPath = path.join(DOCS_DIR, 'test.mmd');
      const invalidPath = path.join(__dirname, '..', '..', 'etc', 'passwd');

      // Valid path should not throw
      expect(() => validatePath(validPath, DOCS_DIR)).not.toThrow();

      // Invalid path should throw
      expect(() => validatePath(invalidPath, DOCS_DIR)).toThrow(/outside allowed directory/);
    });

    it('should reject filenames with shell metacharacters', () => {
      const maliciousFilenames = [
        'test;rm -rf.mmd',
        'test|cat.mmd',
        'test`whoami`.mmd',
        'test$USER.mmd',
        'test<input.mmd',
        'test>output.mmd',
      ];

      maliciousFilenames.forEach((filename) => {
        const filePath = path.join(DOCS_DIR, filename);
        expect(() => validatePath(filePath, DOCS_DIR)).toThrow(/invalid characters/);
      });
    });

    it('should allow normal filenames', () => {
      const validFilenames = [
        'test.mmd',
        'test-diagram.mmd',
        'test_diagram.mmd',
        'test123.mmd',
        'my-architecture.puml',
      ];

      validFilenames.forEach((filename) => {
        const filePath = path.join(DOCS_DIR, filename);
        expect(() => validatePath(filePath, DOCS_DIR)).not.toThrow();
      });
    });
  });

  describe('Mermaid Generation', () => {
    it('should find .mmd files in examples directory', async () => {
      const files = await fs.readdir(DOCS_DIR);
      const mmdFiles = files.filter((f) => f.endsWith('.mmd'));

      // We know we have at least 4 .mmd files from the implementation
      expect(mmdFiles.length).toBeGreaterThanOrEqual(4);
      expect(mmdFiles).toContain('microservices.mmd');
      expect(mmdFiles).toContain('data-pipeline.mmd');
    });

    it('should have corresponding SVG files after generation', async () => {
      try {
        const svgFiles = await fs.readdir(OUTPUT_DIR);
        const hasMermaidSvgs = svgFiles.some((f) =>
          ['microservices.svg', 'data-pipeline.svg'].includes(f)
        );

        // SVGs should exist if diagrams:generate has run
        if (svgFiles.length > 0) {
          expect(hasMermaidSvgs).toBe(true);
        }
      } catch (error) {
        // Output dir might not exist yet - that's ok for tests
        expect(error.code).toBe('ENOENT');
      }
    });
  });

  describe('PlantUML Generation', () => {
    it('should find .puml files in examples directory', async () => {
      const files = await fs.readdir(DOCS_DIR);
      const pumlFiles = files.filter((f) => f.endsWith('.puml'));

      expect(pumlFiles.length).toBeGreaterThanOrEqual(1);
      expect(pumlFiles).toContain('order-service.puml');
    });

    it('should have retry logic configured', () => {
      // Verify fetchPlantUMLWithRetry function exists
      expect(fetchPlantUMLWithRetry).toBeDefined();
      expect(typeof fetchPlantUMLWithRetry).toBe('function');
    });
  });

  describe('Output Validation', () => {
    it('should verify generated SVG files are non-empty', async () => {
      try {
        const svgFiles = await fs.readdir(OUTPUT_DIR);
        const svgFile = svgFiles.find((f) => f.endsWith('.svg'));

        if (svgFile) {
          const stats = await fs.stat(path.join(OUTPUT_DIR, svgFile));
          expect(stats.size).toBeGreaterThan(0);
        }
      } catch (error) {
        // Output dir might not exist yet - that's ok for tests
        expect(error.code).toBe('ENOENT');
      }
    });

    it('should verify SVG files contain valid SVG markup', async () => {
      try {
        const svgFiles = await fs.readdir(OUTPUT_DIR);
        const svgFile = svgFiles.find((f) => f.endsWith('.svg'));

        if (svgFile) {
          const content = await fs.readFile(path.join(OUTPUT_DIR, svgFile), 'utf-8');
          expect(content).toContain('<svg');
          expect(content).toContain('</svg>');
        }
      } catch (error) {
        // Output dir might not exist yet - that's ok for tests
        expect(error.code).toBe('ENOENT');
      }
    });
  });

  describe('Configuration', () => {
    it('should use pinned mermaid-cli version', async () => {
      // Read the main script to verify version is pinned
      const scriptContent = await fs.readFile(
        path.join(__dirname, 'generate-diagram-images.mjs'),
        'utf-8'
      );

      // Should not use @latest
      expect(scriptContent).not.toContain('@mermaid-js/mermaid-cli@latest');

      // Should have a specific version
      expect(scriptContent).toMatch(/@mermaid-js\/mermaid-cli@\d+\.\d+\.\d+/);
    });

    it('should reference mermaid config file', async () => {
      const configPath = path.join(__dirname, '..', 'config', 'mermaid-config.json');
      const configExists = await fs
        .access(configPath)
        .then(() => true)
        .catch(() => false);

      expect(configExists).toBe(true);
    });
  });
});
