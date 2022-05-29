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
