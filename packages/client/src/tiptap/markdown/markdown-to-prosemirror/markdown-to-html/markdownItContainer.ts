import container from 'markdown-it-container';
import { jsonToDOMDataset, strToJSON } from 'tiptap/prose-utils';

export const createMarkdownContainer = (types: string | Array<string>) => (md) => {
  if (!Array.isArray(types)) {
    types = [types];
  }

  types.forEach((type) => {
    const regexp = new RegExp(`^${type}\\s+(.*)$`);

    md.use(container, type, {
      validate: function (params) {
        return params.trim().match(regexp);
      },

      render: function (tokens, idx, options, env, slf) {
        const tag = tokens[idx];

        if (tag.nesting === 1) {
          tag.attrSet('class', type);

          const m = tag.info.trim().match(regexp);
          if (m[1]) {
            const data = strToJSON(m[1]);
            jsonToDOMDataset(data).forEach(({ key, value }) => {
              tag.attrJoin(key, value);
            });
          }
        }

        return slf.renderToken(tokens, idx, options, env, slf);
      },
    });
  });
  return md;
};
