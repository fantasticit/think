import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { StatusWrapper } from 'tiptap/core/wrappers/status';
import { getDatasetAttribute } from 'tiptap/prose-utils';

type IStatusAttrs = {
  color?: string;
  text?: string;
  defaultShowPicker?: boolean;
  createUser: string;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    status: {
      setStatus: (arg: IStatusAttrs) => ReturnType;
    };
  }
}

export const Status = Node.create({
  name: 'status',
  group: 'inline',
  inline: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      color: {
        default: '#FFA39E',
        parseHTML: getDatasetAttribute('color'),
      },
      text: {
        default: '请设置状态内容',
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
