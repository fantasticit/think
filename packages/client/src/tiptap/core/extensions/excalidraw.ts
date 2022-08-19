import { IUser } from '@think/domains';
import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ExcalidrawWrapper } from 'tiptap/core/wrappers/excalidraw';
import { getDatasetAttribute, nodeAttrsToDataset } from 'tiptap/prose-utils';

const DEFAULT_MIND_DATA = { elements: [] };

export interface IExcalidrawAttrs {
  defaultShowPicker?: boolean;
  createUser?: IUser['id'];
  width?: number | string;
  height?: number;
  data?: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    excalidraw: {
      setExcalidraw: (attrs?: IExcalidrawAttrs) => ReturnType;
    };
  }
}

export const Excalidraw = Node.create({
  name: 'excalidraw',
  group: 'block',
  selectable: true,
  atom: true,
  draggable: true,
  inline: false,

  addAttributes() {
    return {
      defaultShowPicker: {
        default: false,
      },
      createUser: {
        default: null,
      },
      width: {
        default: '100%',
        parseHTML: getDatasetAttribute('width'),
      },
      height: {
        default: 240,
        parseHTML: getDatasetAttribute('height'),
      },
      data: {
        default: DEFAULT_MIND_DATA,
        parseHTML: getDatasetAttribute('data', true),
      },
    };
  },

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'excalidraw',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[class=excalidraw]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, nodeAttrsToDataset(node))];
  },

  addCommands() {
    return {
      setExcalidraw:
        (options) =>
        ({ tr, commands, chain, editor }) => {
          options = options || {};
          options.data = options.data || DEFAULT_MIND_DATA;

          // @ts-ignore
          if (tr.selection?.node?.type?.name == this.name) {
            return commands.updateAttributes(this.name, options);
          }

          return chain()
            .insertContent({
              type: this.name,
              attrs: options,
            })
            .run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ExcalidrawWrapper);
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^\$excalidraw\$$/,
        type: this.type,
        getAttributes: () => {
          return { width: '100%' };
        },
      }),
    ];
  },
});
