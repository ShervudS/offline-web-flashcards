export const getFromLocalStorage = <T>(
  key: string,
  defaultValue: T | null = null
): T | null => {
  try {
    const item = localStorage?.getItem(key);
    if (!item) return defaultValue;

    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`[localStorage] Failed to parse key "${key}":`, error);
    return defaultValue;
  }
};

export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    if (value === null) {
      localStorage?.removeItem(key);
    } else {
      localStorage?.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.warn(`[localStorage] Failed to save key "${key}":`, error);
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage?.removeItem(key);
  } catch (error) {
    console.warn(`[localStorage] Failed to remove key "${key}":`, error);
  }
};

export const hasInLocalStorage = (key: string): boolean => {
  try {
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
};
