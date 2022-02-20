export function getStorage(key) {
  if (typeof window === "undefined") throw new Error();

  const value = localStorage.getItem(key);
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

export const setStorage = (key, value) => {
  window.localStorage.setItem(key, "" + value);
};
