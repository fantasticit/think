import { mergeAttributes } from '@tiptap/core';
import TitapParagraph from '@tiptap/extension-paragraph';

export const Paragraph = TitapParagraph.extend({
  draggable: true,

  renderHTML({ HTMLAttributes }) {
    return [
      'p',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      [
        'div',
        {
          'contentEditable': 'false',
          'draggable': 'true',
          'data-drag-handle': 'true',
        },
      ],
      ['div', 0],
    ];
  },
});
