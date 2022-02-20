export function array2tree(list) {
  let map = {},
    node,
    roots = [],
    i;

  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i;
    list[i].children = [];
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.parentDocumentId) {
      if (list[map[node.parentDocumentId]]) {
        list[map[node.parentDocumentId]].children.push(node);
      } else {
        node.parentDocumentId = null; // 该节点的父节点无法访问
      }
    } else {
      roots.push(node);
    }
  }
  return roots;
}
