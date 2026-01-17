/**
 * File parsing and extraction using ts-morph
 */

import { Project, ts } from 'ts-morph';
import { extractClasses } from './class-extractor.js';
import { extractInterfaces } from './interface-extractor.js';
import { extractImports } from './import-extractor.js';

/**
 * Parse and extract information from source files
 * @param {string[]} filePaths - Array of file paths to parse
 * @returns {Promise<import('./types.js').FileExtraction[]>}
 */
export async function parseFiles(filePaths) {
  const project = new Project({
    compilerOptions: {
      allowJs: true,
      jsx: ts.JsxEmit.React,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
    },
    skipAddingFilesFromTsConfig: true,
  });

  // Add all files to the project
  for (const filePath of filePaths) {
    project.addSourceFileAtPath(filePath);
  }

  const extractions = [];

  for (const sourceFile of project.getSourceFiles()) {
    try {
      const filePath = sourceFile.getFilePath();

      extractions.push({
        filePath,
        classes: extractClasses(sourceFile),
        interfaces: extractInterfaces(sourceFile),
        imports: extractImports(sourceFile),
      });
    } catch (error) {
      // Log parse error but continue with other files
      const filePath = sourceFile.getFilePath();
      console.warn(`Parse error in ${filePath}: ${error.message}`);

      extractions.push({
        filePath,
        classes: [],
        interfaces: [],
        imports: [],
      });
    }
  }

  return extractions;
}
