import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { getDatasetAttribute, isInTitle } from 'tiptap/prose-utils';

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

export const Title = Node.create<TitleOptions>({
  name: TitleExtensionName,
  content: 'inline*',
  group: 'block',
  selectable: true,

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

  renderHTML({ HTMLAttributes }) {
    return ['h1', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TitleWrapper);
  },

  addProseMirrorPlugins() {
    const { editor } = this;

    return [
      new Plugin({
        key: new PluginKey(this.name),
        props: {
          handleKeyDown(view, evt) {
            const { state, dispatch } = view;

            if (isInTitle(view.state) && evt.code === 'Enter') {
              evt.preventDefault();

              const paragraph = state.schema.nodes.paragraph;

              if (!paragraph) {
                return;
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
      }),
      new Plugin({
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
        },
      }),
    ];
  },
});
