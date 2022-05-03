import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { LoadingWrapper } from 'tiptap/core/wrappers/loading';

export const Loading = Node.create({
  name: 'loading',
  inline: true,
  group: 'inline',
  atom: true,

  addAttributes() {
    return {
      text: {
        default: null,
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(LoadingWrapper);
  },
});
