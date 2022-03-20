import { Node, Command, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { KatexWrapper } from '../components/katex';

declare module '@tiptap/core' {
  interface Commands {
    katex: {
      setKatex: () => Command;
    };
  }
}

export const KatexInputRegex = /^\$\$(.+)?\$\$$/;

export const Katex = Node.create({
  name: 'katex',
  group: 'block',
  defining: true,
  draggable: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      text: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type=katex]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes((this.options && this.options.HTMLAttributes) || {}, HTMLAttributes),
    ];
  },

  // @ts-ignore
  addCommands() {
    return {
      setKatex:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: KatexInputRegex,
        type: this.type,
        getAttributes: (match) => {
          return { text: match[1] };
        },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(KatexWrapper);
  },
});
