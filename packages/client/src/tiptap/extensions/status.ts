import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { StatusWrapper } from '../wrappers/status';
import { getDatasetAttribute } from '../utils/dataset';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    status: {
      setStatus: () => ReturnType;
    };
  }
}

export const Status = Node.create({
  name: 'status',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      color: {
        default: 'grey',
        parseHTML: getDatasetAttribute('color'),
      },
      text: {
        default: '',
        parseHTML: getDatasetAttribute('text'),
      },
    };
  },

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'status',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span.status',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setStatus:
        (options = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(StatusWrapper);
  },
});
