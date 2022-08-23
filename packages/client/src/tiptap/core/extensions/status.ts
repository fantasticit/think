import { IUser } from '@think/domains';
import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { STATUS_COLORS, StatusWrapper } from 'tiptap/core/wrappers/status';
import { getDatasetAttribute } from 'tiptap/prose-utils';

type IStatusAttrs = {
  color?: string;
  text?: string;
  defaultShowPicker?: boolean;
  createUser?: IUser['id'];
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
      defaultShowPicker: {
        default: false,
      },
      createUser: {
        default: null,
      },
      color: {
        default: STATUS_COLORS[0][1],
        parseHTML: getDatasetAttribute('color'),
      },
      bgcolor: {
        default: STATUS_COLORS[0][2],
        parseHTML: getDatasetAttribute('bgcolor'),
      },
      borderColor: {
        default: STATUS_COLORS[0][3],
        parseHTML: getDatasetAttribute('borderColor'),
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
