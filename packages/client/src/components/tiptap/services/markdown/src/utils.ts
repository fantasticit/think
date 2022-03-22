import { BaseKit } from '../../../basekit';

export const getAttributes = (name: string, element: HTMLElement): Record<string, unknown> => {
  const ext = BaseKit.find((ext) => ext.name === name);

  const run = (
    ret = {},
    config: Record<string, { default: unknown; parseHTML?: (element: HTMLElement) => Record<string, unknown> }>
  ) => {
    return Object.keys(config).reduce((accu, key) => {
      const conf = config[key];
      accu[key] = conf.default;

      if (conf.parseHTML) {
        try {
          accu[key] = conf.parseHTML(element);
        } catch (e) {
          //
        }
      }

      return accu;
    }, ret);
  };

  let parent = ext && ext.parent;

  if (!parent) return {};

  while (parent.parent) {
    parent = parent.parent;
  }

  const { config } = parent;
  const { addGlobalAttributes, addAttributes } = config;
  const attrs = {};

  if (addGlobalAttributes) {
    run(attrs, addGlobalAttributes.call(ext));
  }

  if (addAttributes) {
    run(attrs, addAttributes.call(ext));
  }

  return attrs;
};
