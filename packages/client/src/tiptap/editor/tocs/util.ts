export const parseHeadingsToTocs = (headings) => {
  const list = JSON.parse(JSON.stringify(headings));
  const ret = [];

  list.forEach((heading, index) => {
    const prev = list[index - 1];

    if (!prev) {
      ret.push(heading);
    } else {
      if (prev.level < heading.level) {
        heading.parent = prev;
        prev.children = prev.children || [];
        prev.children.push(heading);
      } else {
        let parent = prev.parent;

        let shouldContinue = true;

        while (shouldContinue) {
          if (!parent) {
            shouldContinue = false;
            ret.push(heading);
          } else if (parent.level < heading.level) {
            heading.parent = parent;
            parent.children = parent.children || [];
            parent.children.push(heading);
            shouldContinue = false;
          } else {
            parent = parent.parent;
          }
        }
      }
    }
  });

  return ret;
};
