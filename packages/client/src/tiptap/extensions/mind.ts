import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Plugin, PluginKey } from 'prosemirror-state';
import { MindWrapper } from 'tiptap/wrappers/mind';
import { getDatasetAttribute } from 'tiptap/prose-utils';

const DEFAULT_MIND_DATA = {
  root: { data: { text: '中心节点' }, children: [] },
  template: 'default',
  theme: 'classic',
  version: '1.4.43',
};

export interface IMindAttrs {
  width?: number;
  height?: number;
  data?: Record<string, unknown>;
  template?: string;
  theme?: string;
  zoom?: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mind: {
      setMind: (attrs?: IMindAttrs) => ReturnType;
    };
  }
}

export const Mind = Node.create({
  name: 'mind',
  group: 'block',
  selectable: true,
  atom: true,
  inline: false,

  addAttributes() {
    return {
      width: {
        default: null,
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
      template: {
        default: 'default',
        parseHTML: getDatasetAttribute('template'),
      },
      theme: {
        default: 'classic',
        parseHTML: getDatasetAttribute('theme'),
      },
      zoom: {
        default: 100,
        parseHTML: getDatasetAttribute('zoom'),
      },
    };
  },

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'mind',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setMind:
        (options) =>
        ({ tr, commands, chain, editor }) => {
          options = options || {};
          options.data = options.data || DEFAULT_MIND_DATA;

          // @ts-ignore
          if (tr.selection?.node?.type?.name == this.name) {
            return commands.updateAttributes(this.name, options);
          }

          const { selection } = editor.state;
          const pos = selection.$head;
          return chain()
            .insertContentAt(pos.before(), [
              {
                type: this.name,
                attrs: options,
              },
            ])
            .run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(MindWrapper);
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^\$mind $/,
        type: this.type,
        getAttributes: (match) => {
          return { type: match[1] };
        },
      }),
    ];
  },

  addProseMirrorPlugins() {
    const { editor } = this;

    return [
      new Plugin({
        key: new PluginKey('mind'),
        props: {
          handleKeyDown(view, event) {
            if (editor.isActive('mind')) {
              return true;
            }
          },
        },
      }),
    ];
  },
});
