import { Renderer } from './renderer';

const renderer = new Renderer();

/**
 * 将 HTML 转换成 prosemirror node
 * @param body
 * @param forceATitle 是否需要一个标题
 * @returns
 */
export const htmlToPromsemirror = (body, forceATitle = false) => {
  const json = renderer.render(body);

  // 设置标题
  if (forceATitle) {
    const firstNode = json.content[0];
    if (firstNode && firstNode.type !== 'title') {
      if (firstNode.type === 'heading' || firstNode.type === 'paragraph') {
        firstNode.type = 'title';
      }
    }
  }

  const nodes = json.content;
  const result = { type: 'doc', content: [] };

  for (let i = 0; i < nodes.length; ) {
    const node = nodes[i];
    // 目的：合并成 promirror 需要的 table 格式
    if (node.type === 'tableRow') {
      const nextNode = nodes[i + 1];
      if (nextNode && nextNode.type === 'table') {
        nextNode.content.unshift(node);
        result.content.push(nextNode);
        i += 2;
      }
    } else {
      result.content.push(node);
      i += 1;
    }
  }

  // trailing node
  result.content.push({
    type: 'paragraph',
    attrs: {
      indent: 0,
      textAlign: 'left',
    },
  });

  return result;
};
