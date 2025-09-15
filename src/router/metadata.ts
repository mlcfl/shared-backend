/**
 * Metadata storage for decorators
 * Used instead of reflect-metadata for standard decorators
 */

// Metadata for methods
export const methodMetadata = new WeakMap<object, Record<string, any>>();

// Metadata for classes
export const classMetadata = new WeakMap<Function, Record<string, any>>();

/**
 * Sets metadata for a method
 */
export function setMethodMetadata(
	target: object,
	propertyKey: string,
	metadata: Record<string, any>
) {
	const existing = methodMetadata.get(target) || {};
	existing[propertyKey] = { ...existing[propertyKey], ...metadata };
	methodMetadata.set(target, existing);
}

/**
 * Gets metadata for a method
 */
export function getMethodMetadata(
	target: object,
	propertyKey: string
): Record<string, any> {
	const targetMetadata = methodMetadata.get(target) || {};
	return targetMetadata[propertyKey] || {};
}

/**
 * Sets metadata for a class
 */
export function setClassMetadata(
	target: Function,
	metadata: Record<string, any>
) {
	const existing = classMetadata.get(target) || {};
	classMetadata.set(target, { ...existing, ...metadata });
}

/**
 * Gets metadata for a class
 */
export function getClassMetadata(target: Function): Record<string, any> {
	return classMetadata.get(target) || {};
}
