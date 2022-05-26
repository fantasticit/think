export function getStorage(key, defaultValue = null) {
  if (typeof window === 'undefined') throw new Error();

  const value = localStorage.getItem(key);
  if (!value) return defaultValue;
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

export const setStorage = (key, value) => {
  window.localStorage.setItem(key, '' + value);
};
