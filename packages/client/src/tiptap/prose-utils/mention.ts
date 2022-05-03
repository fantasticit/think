import { Editor } from '@tiptap/core';
import { Mention } from 'tiptap/core/extensions/mention';

export const findMentions = (editor: Editor) => {
  const content = editor.getJSON();
  const queue = [content];
  const res = [];

  while (queue.length) {
    const node = queue.shift();

    if (node.type === Mention.name) {
      res.push(node.attrs.id);
    }

    if (node.content && node.content.length) {
      queue.push(...node.content);
    }
  }

  return res;
};
