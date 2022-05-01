import { safeJSONParse } from 'helpers/json';

/**
 * 将 JSON 转为字符串
 * @param json
 */
export const jsonToStr = (json: Record<string, unknown>) => {
  try {
    return JSON.stringify(json);
  } catch (e) {
    return JSON.stringify({});
  }
};

/**
 * 将字符串转为 JSON
 * @param str
 */
export const strToJSON = (str: string) => {
  return safeJSONParse(str);
};

/**
 * 将 JSON 转为 DOM 节点的 dataset
 * @param element
 * @param json
 */
export const jsonToDOMDataset = (json: Record<string, unknown>) => {
  return Object.keys(json).map((key) => {
    let value = json[key];

    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }

    return {
      key: `data-${key}`,
      value: encodeURIComponent(value as string),
    };
  });
};

/**
 * 从 element 上提取 dataset 数据
 * @param element
 * @param attribute
 * @param transformToJSON 是否要转为 JSON
 */
export const getDatasetAttribute =
  (attribute: string, transformToJSON = false) =>
  (element: HTMLElement) => {
    const dataKey = attribute.startsWith('data-') ? attribute : `data-${attribute}`;
    const value = decodeURIComponent(element.getAttribute(dataKey));

    if (transformToJSON) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return {};
      }
    }

    if (value.includes('%') || value.includes('auto')) {
      return value;
    }

    const toNumber = parseInt(value);
    return toNumber !== toNumber ? value : toNumber; // 避免 NaN
  };
