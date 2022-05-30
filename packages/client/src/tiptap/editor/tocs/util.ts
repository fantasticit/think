export const flattenHeadingsToTree = (tocs) => {
  const result = [];
  const levels = [result];

  tocs.forEach((o) => {
    let offset = -1;
    let parent = levels[o.level + offset];

    while (!parent) {
      offset -= 1;
      parent = levels[o.level + offset];
    }

    parent.push({ ...o, children: (levels[o.level] = []) });
  });

  return result;
};
