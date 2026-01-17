/**
 * Import extraction utilities using ts-morph
 */

/**
 * Extract all import declarations from a source file
 * @param {import('ts-morph').SourceFile} sourceFile
 * @returns {import('./types.js').ExtractedImport[]}
 */
export function extractImports(sourceFile) {
  const imports = [];

  for (const importDecl of sourceFile.getImportDeclarations()) {
    try {
      const source = importDecl.getModuleSpecifierValue();
      const isTypeOnly = importDecl.isTypeOnly();

      // Get imported names
      const importedNames = [];

      // Named imports: import { foo, bar } from '...'
      const namedImports = importDecl.getNamedImports();
      for (const named of namedImports) {
        importedNames.push(named.getName());
      }

      // Default import: import foo from '...'
      const defaultImport = importDecl.getDefaultImport();
      if (defaultImport) {
        importedNames.push(defaultImport.getText());
      }

      // Namespace import: import * as foo from '...'
      const namespaceImport = importDecl.getNamespaceImport();
      if (namespaceImport) {
        importedNames.push(`* as ${namespaceImport.getText()}`);
      }

      imports.push({
        source,
        importedNames,
        isTypeOnly,
      });
    } catch (error) {
      console.warn(`Error extracting import: ${error.message}`);
    }
  }

  return imports;
}
