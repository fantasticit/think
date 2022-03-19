export const getParents = (element) => {
  const parents = [];
  let parent = element.parentNode;

  do {
    parents.push(parent);
    parent = parent.parentNode;
  } while (parent);

  return parents;
};
