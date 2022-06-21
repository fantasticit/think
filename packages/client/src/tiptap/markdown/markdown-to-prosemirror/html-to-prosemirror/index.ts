import { Renderer } from './renderer';

const renderer = new Renderer();

/**
 * 将 HTML 转换成 prosemirror node
 * @param body
 * @param needTitle 是否需要一个标题
 * @param defaultTitle 优先作为文档标题，否则默认读取一个 heading 或者 paragraph 的文字内容
 * @returns
 */
export const htmlToPromsemirror = (body, needTitle = false, defaultTitle = '') => {
  const json = renderer.render(body);

  // 设置标题
  if (needTitle) {
    if (json.content[0].type !== 'title') {
      const forceTitleNode = json.content.find((node) => {
        return node.type === 'heading' || node.type === 'paragraph';
      });

      json.content.unshift({
        type: 'title',
        content: [
          {
            type: 'text',
            text: defaultTitle || forceTitleNode?.content[0]?.text.slice(0, 50) || '未命名标题',
          },
        ],
      });
    }
  } else {
    if (json.content[0].type === 'title') {
      json.content[0].type = 'paragraph';
      json.content[0].attrs = {};
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

  return result;
};
