export function flattenTree2Array(arr = []) {
  const res = [];
  const loopList = [...arr];

  while (loopList.length) {
    const node = loopList.pop();

    res.push(node);

    if (node?.children && node?.children.length) {
      for (const sub of node.children) {
        loopList.push(sub);
      }
    }
  }

  return res;
}

export function findParents(data, childId: string): Array<string> {
  const flatten = flattenTree2Array(data).map((d) => ({
    id: d?.id,
    parentDocumentId: d?.parentDocumentId,
  }));

  const res = [];
  let parent = flatten.find((d) => d.id === childId);

  while (parent) {
    res.push(parent.id);
    parent = flatten.find((d) => d.id === parent?.parentDocumentId);
  }

  return res as Array<string>;
}
