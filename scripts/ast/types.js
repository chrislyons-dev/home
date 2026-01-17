/**
 * Type definitions for AST extraction
 * Using JSDoc comments for type safety in JavaScript
 */

/**
 * @typedef {Object} ExtractedMethod
 * @property {string} name - Method name
 * @property {'public' | 'private' | 'protected'} visibility - Method visibility
 * @property {boolean} isStatic - Whether method is static
 * @property {boolean} isAsync - Whether method is async
 * @property {ParameterInfo[]} parameters - Method parameters
 * @property {string} [returnType] - Return type
 */

/**
 * @typedef {Object} ExtractedProperty
 * @property {string} name - Property name
 * @property {'public' | 'private' | 'protected'} visibility - Property visibility
 * @property {boolean} isStatic - Whether property is static
 * @property {boolean} isReadonly - Whether property is readonly
 * @property {string} [type] - Property type
 */

/**
 * @typedef {Object} ExtractedClass
 * @property {string} name - Class name
 * @property {boolean} isExported - Whether class is exported
 * @property {boolean} isAbstract - Whether class is abstract
 * @property {string} [extends] - Parent class name
 * @property {string[]} [implements] - Implemented interface names
 * @property {ExtractedMethod[]} methods - Class methods
 * @property {ExtractedProperty[]} properties - Class properties
 * @property {string} filePath - Source file path
 */

/**
 * @typedef {Object} InterfaceProperty
 * @property {string} name - Property name
 * @property {string} type - Property type
 * @property {boolean} optional - Whether property is optional
 * @property {boolean} readonly - Whether property is readonly
 */

/**
 * @typedef {Object} InterfaceMethod
 * @property {string} name - Method name
 * @property {ParameterInfo[]} parameters - Method parameters
 * @property {string} returnType - Return type
 */

/**
 * @typedef {Object} ExtractedInterface
 * @property {string} name - Interface name
 * @property {boolean} isExported - Whether interface is exported
 * @property {string[]} extends - Extended interface names
 * @property {InterfaceProperty[]} properties - Interface properties
 * @property {InterfaceMethod[]} methods - Interface methods
 * @property {string} filePath - Source file path
 */

/**
 * @typedef {Object} ParameterInfo
 * @property {string} name - Parameter name
 * @property {string} [type] - Parameter type
 * @property {boolean} optional - Whether parameter is optional
 * @property {string} [defaultValue] - Default value if any
 */

/**
 * @typedef {Object} ExtractedImport
 * @property {string} source - Import source module
 * @property {string[]} importedNames - Imported names
 * @property {boolean} isTypeOnly - Whether import is type-only
 */

/**
 * @typedef {Object} FileExtraction
 * @property {string} filePath - File path
 * @property {ExtractedClass[]} classes - Extracted classes
 * @property {ExtractedInterface[]} interfaces - Extracted interfaces
 * @property {ExtractedImport[]} imports - Extracted imports
 */

// Export empty object to make this a module
export {};
