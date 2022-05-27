export const safeJSONParse = (str, defaultValue = {}) => {
  if (typeof str === 'object') return str;

  try {
    return JSON.parse(str);
  } catch (e) {
    return defaultValue;
  }
};

export const safeJSONStringify = (obj, defaultValue = '{}') => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    return defaultValue;
  }
};
