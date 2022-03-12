import { Node, mergeAttributes } from '@tiptap/core';
import Document from '@tiptap/extension-document';

const Title = Node.create({
  name: 'title',
  group: 'block',
  content: 'text*',

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

const TitledDocument = Document.extend({
  content: 'title block+',
});

export { Document, Title, TitledDocument };
