import container from 'markdown-it-container';

const typesAvailable = ['callout'];

const buildRender = (type) => (tokens, idx, options, env, slf) => {
  const tag = tokens[idx];

  if (tag.nesting === 1) {
    tag.attrJoin('class', `callout`);
  }

  return slf.renderToken(tokens, idx, options, env, slf);
};

/**
 * @param {object} md Markdown object
 */
export default function markdownCallout(md) {
  // create a custom container to each callout type
  typesAvailable.forEach((type) => {
    md.use(container, type, {
      render: buildRender(type),
    });
  });

  return md;
}
