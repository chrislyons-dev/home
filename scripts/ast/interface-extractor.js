/**
 * Interface extraction utilities using ts-morph
 */

/**
 * Extract interfaces from a source file
 * @param {import('ts-morph').SourceFile} sourceFile
 * @returns {import('./types.js').ExtractedInterface[]}
 */
export function extractInterfaces(sourceFile) {
  const interfaces = [];

  for (const interfaceDecl of sourceFile.getInterfaces()) {
    try {
      const name = interfaceDecl.getName();

      interfaces.push({
        name,
        isExported: interfaceDecl.isExported(),
        extends: interfaceDecl.getExtends().map((e) => e.getText()),
        properties: interfaceDecl.getProperties().map((prop) => ({
          name: prop.getName(),
          type: prop.getType().getText(),
          optional: prop.hasQuestionToken(),
          readonly: prop.isReadonly(),
        })),
        methods: interfaceDecl.getMethods().map((method) => ({
          name: method.getName(),
          parameters: method.getParameters().map((param) => ({
            name: param.getName(),
            type: param.getType().getText(),
            optional: param.isOptional(),
          })),
          returnType: method.getReturnType().getText(),
        })),
        filePath: sourceFile.getFilePath(),
      });
    } catch (error) {
      console.warn(`Error extracting interface ${interfaceDecl.getName()}: ${error.message}`);
    }
  }

  return interfaces;
}
