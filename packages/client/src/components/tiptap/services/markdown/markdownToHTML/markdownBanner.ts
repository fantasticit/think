import container from 'markdown-it-container';

export const typesAvailable = ['info', 'warning', 'danger', 'success'];

const buildRender = (type) => (tokens, idx, options, env, slf) => {
  const tag = tokens[idx];

  // add attributes to the opening tag
  if (tag.nesting === 1) {
    tag.attrSet('data-banner', type);
    tag.attrJoin('class', `banner banner-${type}`);
  }

  return slf.renderToken(tokens, idx, options, env, slf);
};

/**
 * @param {object} md Markdown object
 */
export default function markdownBanner(md) {
  // create a custom container to each callout type
  typesAvailable.forEach((type) => {
    md.use(container, type, {
      render: buildRender(type),
    });
  });

  return md;
}
