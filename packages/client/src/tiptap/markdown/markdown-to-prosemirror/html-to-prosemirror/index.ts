import { Renderer } from './renderer';

const renderer = new Renderer();

/**
 * 将 HTML 转换成 prosemirror node
 * @param body
 * @param forceATitle 是否需要一个标题
 * @param defaultTitle 优先作为文档标题，否则默认读取一个 heading 或者 paragraph 的文字内容
 * @returns
 */
export const htmlToPromsemirror = (body, forceATitle = false, defaultTitle = '') => {
  const json = renderer.render(body);

  // 设置标题
  if (forceATitle) {
    const forceTitleNode = json.content.find((node) => {
      return node.type === 'heading' || node.type === 'paragraph';
    });

    json.content.unshift({
      type: 'title',
      content: [
        {
          type: 'text',
          text: defaultTitle || forceTitleNode?.content[0]?.text.slice(0, 50),
        },
      ],
    });
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
