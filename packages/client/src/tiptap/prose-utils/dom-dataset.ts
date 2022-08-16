import { safeJSONParse } from 'helpers/json';
import { Node } from 'prosemirror-state';

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
    let value = decodeURIComponent(element.getAttribute(dataKey));

    if (value == null || (typeof value === 'string' && value === 'null')) {
      try {
        const html = element.outerHTML;
        // eslint-disable-next-line no-useless-escape
        const texts = html.match(/(.|\s)+?\="(.|\s)+?"/gi);
        if (texts && texts.length) {
          const params = texts
            .map((str) => str.trim())
            .reduce((accu, item) => {
              const i = item.indexOf('=');
              const arr = [item.slice(0, i), item.slice(i + 1).slice(1, -1)];
              accu[arr[0]] = arr[1];
              return accu;
            }, {});

          value = (params[attribute.toLowerCase()] || '').replaceAll('&quot;', '"');
        }
      } catch (e) {
        console.error('解析 element 失败！', e.message, element);
      }
    }

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

/**
 * 将节点属性转换为 dataset
 * @param node
 * @returns
 */
export const nodeAttrsToDataset = (node: Node) => {
  const { attrs } = node;

  return Object.keys(attrs).reduce((accu, key) => {
    const value = attrs[key];

    if (value == null) {
      return accu;
    }

    let encodeValue = '';

    if (typeof value === 'object') {
      encodeValue = jsonToStr(value);
    } else {
      encodeValue = value;
    }

    accu[key] = encodeValue;

    return accu;
  }, Object.create(null));
};
