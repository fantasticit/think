import { Editor, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Node as PMNode } from 'prosemirror-state';
import { LoadingWrapper } from 'tiptap/core/wrappers/loading';

export function findLoadingById(editor: Editor, id: string): null | { node: PMNode; pos: number } {
  let target: PMNode | null = null;
  let pos = -1;

  editor.state.doc.descendants((node, nodePos) => {
    if (node.type.name === 'loading' && node.attrs.id === id) {
      target = node;
      pos = nodePos;
    }
  });

  return target ? { node: target, pos } : null;
}

export const Loading = Node.create({
  name: 'loading',
  inline: true,
  group: 'inline',
  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
      text: {
        default: null,
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(LoadingWrapper);
  },
});
