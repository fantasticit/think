import { Node, Command, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { BannerWrapper } from '../components/banner';

declare module '@tiptap/core' {
  interface Commands {
    banner: {
      setBanner: () => Command;
    };
  }
}

export const Banner = Node.create({
  name: 'banner',
  content: 'block*',
  group: 'block',
  defining: true,
  draggable: true,

  addAttributes() {
    return {
      type: {
        default: 'info',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'banner' },
      [
        'div',
        mergeAttributes((this.options && this.options.HTMLAttributes) || {}, HTMLAttributes),
        0,
      ],
    ];
  },

  // @ts-ignore
  addCommands() {
    return {
      setBanner:
        (attributes) =>
        ({ commands, editor }) => {
          const { type = null } = editor.getAttributes(this.name);
          if (type) {
            commands.lift(this.name);
          } else {
            return commands.toggleWrap(this.name, attributes);
          }
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(BannerWrapper);
  },
});
