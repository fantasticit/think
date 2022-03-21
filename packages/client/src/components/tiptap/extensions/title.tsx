import { Node, mergeAttributes } from '@tiptap/core';

export const Title = Node.create({
  name: 'title',
  content: 'text*',
  selectable: true,
  defining: true,
  inline: false,
  group: 'basic',
  allowGapCursor: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'title',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'h1[class=title]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['h1', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
});
