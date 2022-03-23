import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { KatexWrapper } from '../components/katex';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    katex: {
      setKatex: () => ReturnType;
    };
  }
}

export const KatexInputRegex = /^\$\$(.+)?\$\$$/;

export const Katex = Node.create({
  name: 'katex',
  group: 'inline',
  inline: true,
  selectable: true,
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'katex',
      },
    };
  },

  addAttributes() {
    return {
      text: {
        default: '',
        parseHTML: (element) => {
          return element.getAttribute('data-text');
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span.katex' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes((this.options && this.options.HTMLAttributes) || {}, HTMLAttributes)];
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
