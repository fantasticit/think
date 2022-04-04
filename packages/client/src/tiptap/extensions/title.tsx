import { Node, mergeAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { isInTitle } from '../utils/node';
import { TextSelection } from 'prosemirror-state';

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

export const Title = Node.create<TitleOptions>({
  name: 'title',
  content: 'inline*',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'title',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'p[class=title]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addProseMirrorPlugins() {
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
              const endPos = titleNode.firstChild.nodeSize + 1;

              dispatch(state.tr.insert(endPos, paragraph.create()));

              const newState = view.state;
              const next = new TextSelection(newState.doc.resolve(endPos + 2));
              dispatch(newState.tr.setSelection(next));
              return true;
            }
          },
        },
      }),
    ];
  },
});
