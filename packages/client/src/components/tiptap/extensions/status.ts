import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { StatusWrapper } from '../components/status';

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

  addAttributes() {
    return {
      color: {
        default: 'grey',
      },
      text: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type=status]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes((this.options && this.options.HTMLAttributes) || {}, HTMLAttributes)];
  },

  // @ts-ignore
  addCommands() {
    return {
      setStatus:
        (options) =>
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
