import { Node, mergeAttributes } from '@tiptap/core';

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
  group: 'block',
  defining: true,

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
});
