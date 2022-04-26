import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { MindWrapper } from '../wrappers/mind';
import { getDatasetAttribute } from '../utils/dataset';

const DEFAULT_MIND_DATA = {
  root: { data: { text: '中心节点' }, children: [] },
  template: 'default',
  theme: 'fresh-blue',
  version: '1.4.43',
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mind: {
      setMind: (attrs?: unknown) => ReturnType;
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
                attrs: { data: DEFAULT_MIND_DATA },
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
});
