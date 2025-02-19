export const isNotEmptyArray = <T>(
  array: null | unknown | undefined | Array<T>
): array is T[] => Array.isArray(array) && array.length > 0;
