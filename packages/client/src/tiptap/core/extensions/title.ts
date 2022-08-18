import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { getDatasetAttribute, isInTitle, nodeAttrsToDataset } from 'tiptap/prose-utils';

import { TitleWrapper } from '../wrappers/title';

export interface TitleOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    title: {
      setTitle: (attributes) => ReturnType;
      toggleTitle: (attributes) => ReturnType;
    };
  }
}

export const TitleExtensionName = 'title';

const TitlePluginKey = new PluginKey(TitleExtensionName);

export const Title = Node.create<TitleOptions>({
  name: TitleExtensionName,
  content: 'inline*',
  group: 'block',
  defining: true,
  isolating: true,
  showGapCursor: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'node-title',
      },
    };
  },

  addAttributes() {
    return {
      cover: {
        default: '',
        parseHTML: getDatasetAttribute('cover'),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'h1[class=node-title]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const { cover } = node.attrs;
    return [
      'h1',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, nodeAttrsToDataset(node)),
      [
        'img',
        {
          src: cover,
        },
      ],
      ['div', 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TitleWrapper);
  },

  addProseMirrorPlugins() {
    const { editor } = this;
    let shouldSelectTitleNode = true;

    return [
      new Plugin({
        key: TitlePluginKey,
        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations = [];

            doc.descendants((node, pos) => {
              if (node.type.name !== this.name) return;

              decorations.push(
                Decoration.node(pos, pos + node.nodeSize, {
                  class: editor.isEditable ? 'is-editable' : '',
                })
              );
            });

            return DecorationSet.create(doc, decorations);
          },
          handleClick() {
            shouldSelectTitleNode = false;
            return;
          },
          handleDOMEvents: {
            click() {
              shouldSelectTitleNode = false;
              return;
            },
            mousedown() {
              shouldSelectTitleNode = false;
              return;
            },
            pointerdown() {
              shouldSelectTitleNode = false;
              return;
            },
            touchstart() {
              shouldSelectTitleNode = false;
              return;
            },
          },
          handleKeyDown(view, evt) {
            const { state, dispatch } = view;
            shouldSelectTitleNode = false;

            if (isInTitle(view.state) && evt.code === 'Enter') {
              evt.preventDefault();

              const paragraph = state.schema.nodes.paragraph;

              if (!paragraph) {
                return true;
              }

              const $head = state.selection.$head;
              const titleNode = $head.node($head.depth);

              const endPos = ((titleNode.firstChild && titleNode.firstChild.nodeSize) || 0) + 1;

              dispatch(state.tr.insert(endPos, paragraph.create()));

              const newState = view.state;
              const next = new TextSelection(newState.doc.resolve(endPos + 2));
              dispatch(newState.tr.setSelection(next));

              return true;
            }
          },
        },
        appendTransaction: (transactions, oldState, newState) => {
          if (!editor.isEditable) return;

          if (!shouldSelectTitleNode) return;

          const tr = newState.tr;

          const firstNode = newState?.doc?.content?.content?.[0];

          if (firstNode && firstNode.type.name === this.name && firstNode.nodeSize === 2) {
            const selection = new TextSelection(newState.tr.doc.resolve(firstNode?.attrs?.cover ? 1 : 0));
            tr.setSelection(selection).scrollIntoView();
            tr.setMeta('addToHistory', false);
            return tr;
          }

          return;
        },
      }),
    ];
  },
});
