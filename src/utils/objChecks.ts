/**
 * Проверка на обьект
 */
export const isObject = <T>(value: null | undefined | T): value is T & Record<string, unknown> =>
	typeof value === 'object' && !Array.isArray(value) && value !== null;

/**
 * Проверка на пустой объект
 */

export const isNotEmptyObject = <T extends Record<string, unknown>>(
	value: T | undefined | null,
): value is T => isObject(value) && Object.keys(value).length > 0;
