/**
 * Class extraction utilities using ts-morph
 */

import { Scope } from 'ts-morph';

/**
 * Extract all class declarations from a source file
 * @param {import('ts-morph').SourceFile} sourceFile
 * @returns {import('./types.js').ExtractedClass[]}
 */
export function extractClasses(sourceFile) {
  const classes = [];

  for (const cls of sourceFile.getClasses()) {
    try {
      const extracted = extractClass(cls, sourceFile.getFilePath());
      if (extracted) {
        classes.push(extracted);
      }
    } catch (error) {
      console.warn(`Error extracting class ${cls.getName() || '<anonymous>'}: ${error.message}`);
    }
  }

  return classes;
}

/**
 * Extract information from a single class declaration
 * @param {import('ts-morph').ClassDeclaration} cls
 * @param {string} filePath
 * @returns {import('./types.js').ExtractedClass | null}
 */
function extractClass(cls, filePath) {
  const name = cls.getName();
  if (!name) {
    // Skip anonymous classes
    return null;
  }

  // Get base class if it extends another class
  const extendsClause = cls.getExtends();
  const extendsName = extendsClause?.getText();

  // Get implemented interfaces
  const implementsClauses = cls.getImplements();
  const implementsNames = implementsClauses.map((impl) => impl.getText());

  // Extract methods (skip private methods as per user decision)
  const methods = cls
    .getMethods()
    .filter((method) => method.getScope() !== Scope.Private)
    .map((method) => extractMethod(method));

  // Extract properties (skip private properties)
  const properties = cls
    .getProperties()
    .filter((prop) => prop.getScope() !== Scope.Private)
    .map((prop) => extractProperty(prop));

  return {
    name,
    isExported: cls.isExported(),
    isAbstract: cls.isAbstract(),
    extends: extendsName,
    implements: implementsNames.length > 0 ? implementsNames : undefined,
    methods,
    properties,
    filePath,
  };
}

/**
 * Extract method information from a class
 * @param {import('ts-morph').MethodDeclaration} method
 * @returns {import('./types.js').ExtractedMethod}
 */
function extractMethod(method) {
  return {
    name: method.getName(),
    visibility: mapVisibility(method.getScope()),
    isStatic: method.isStatic(),
    isAsync: method.isAsync(),
    parameters: method.getParameters().map((param) => extractMethodParameter(param)),
    returnType: method.getReturnType().getText(),
  };
}

/**
 * Extract property information from a class
 * @param {import('ts-morph').PropertyDeclaration} prop
 * @returns {import('./types.js').ExtractedProperty}
 */
function extractProperty(prop) {
  return {
    name: prop.getName(),
    visibility: mapVisibility(prop.getScope()),
    isStatic: prop.isStatic(),
    isReadonly: prop.isReadonly(),
    type: prop.getType().getText(),
  };
}

/**
 * Extract parameter information
 * @param {ReturnType<import('ts-morph').MethodDeclaration['getParameters']>[0]} param
 * @returns {import('./types.js').ParameterInfo}
 */
function extractMethodParameter(param) {
  const name = param.getName();
  const type = param.getType().getText();
  const optional = param.isOptional();
  const initializer = param.getInitializer();

  return {
    name,
    type: type !== 'any' ? type : undefined,
    optional,
    defaultValue: initializer?.getText(),
  };
}

/**
 * Map ts-morph Scope to our visibility string
 * @param {import('ts-morph').Scope | undefined} scope
 * @returns {'public' | 'private' | 'protected'}
 */
function mapVisibility(scope) {
  if (scope === Scope.Private) return 'private';
  if (scope === Scope.Protected) return 'protected';
  return 'public';
}
