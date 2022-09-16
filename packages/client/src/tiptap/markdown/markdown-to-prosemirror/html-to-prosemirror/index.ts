import { Renderer } from './renderer';

/**
 * 表格的内容格式不正确，需要进行过滤修复
 * @param doc
 * @returns
 */
function fixNode(doc) {
  if (!doc) return;

  const queue = [doc];

  while (queue.length) {
    const node = queue.shift();

    if (node.content) {
      node.content = node.content.filter((subNode) => !(subNode.type === 'text' && subNode.text === '\n'));
    }

    if (node.type === 'table') {
      node.content = (node.content || []).filter((subNode) => subNode.type.includes('table'));
    }

    if (node.type === 'tableRow') {
      node.content = (node.content || []).filter((subNode) => subNode.type === 'tableCell');
    }

    if (node.type === 'tableCell') {
      (node.content || []).forEach((subNode, i) => {
        if (subNode && subNode.type === 'text') {
          node.content[i] = {
            attrs: subNode.attrs || {},
            content: [subNode],
            type: 'paragraph',
          };
        }
      });

      if (!node.content || !node.content.length) {
        node.content = [{ attrs: {}, type: 'paragraph' }];
      }
    }

    if (node.content) {
      queue.push(...(node.content || []).filter((subNode) => subNode.type.includes('table')));
    }
  }
}

/**
 * 将 HTML 转换成 prosemirror node
 * @param body
 * @param needTitle 是否需要一个标题
 * @param defaultTitle 优先作为文档标题，否则默认读取一个 heading 或者 paragraph 的文字内容
 * @returns
 */
export const htmlToProsemirror = (editor, body, needTitle = false, defaultTitle = '') => {
  let renderer = new Renderer(editor);
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

  fixNode(result);

  renderer = null;
  return result;
};
