import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { StatusWrapper } from '../wrappers/status';
import { getDatasetAttribute } from '../utils/dataset';

type IStatusAttrs = {
  color?: string;
  text?: string;
  defaultShowPicker?: boolean;
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
  atom: true,
  selectable: true,

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
