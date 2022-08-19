import { IUser } from '@think/domains';
import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { KatexWrapper } from 'tiptap/core/wrappers/katex';
import { getDatasetAttribute } from 'tiptap/prose-utils';

export type IKatexAttrs = {
  text?: string;
  defaultShowPicker?: boolean;
  createUser?: IUser['id'];
};

interface IKatexOptions {
  HTMLAttributes: Record<string, any>;
  getCreateUserId: () => string | number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    katex: {
      setKatex: (arg?: IKatexAttrs) => ReturnType;
    };
  }
}

export const Katex = Node.create<IKatexOptions>({
  name: 'katex',
  group: 'block',
  selectable: true,
  atom: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'katex',
      },
      getCreateUserId: () => null,
    };
  },

  addAttributes() {
    return {
      text: {
        default: '',
        parseHTML: getDatasetAttribute('text'),
      },
      defaultShowPicker: {
        default: false,
      },
      createUser: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span.katex' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes((this.options && this.options.HTMLAttributes) || {}, HTMLAttributes)];
  },

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
        find: /^\$katex\$$/,
        type: this.type,
        getAttributes: () => {
          return { defaultShowPicker: true, createUser: this.options.getCreateUserId() };
        },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(KatexWrapper);
  },
});
