import { mergeAttributes, Node, wrappingInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { CalloutWrapper } from 'tiptap/core/wrappers/callout';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    banner: {
      setCallout: () => ReturnType;
    };
  }
}

export const Callout = Node.create({
  name: 'callout',
  content: 'paragraph+',
  group: 'block',
  defining: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      emoji: {
        default: '🎯',
      },
      textColor: {
        default: '#d83931',
      },
      borderColor: {
        default: '#fbbfbc',
      },
      backgroundColor: {
        default: '#fef1f1',
      },
    };
  },

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'callout',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[class=callout]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setCallout:
        () =>
        ({ commands, editor }) => {
          const { type = null } = editor.getAttributes(this.name);
          if (type) {
            commands.lift(this.name);
          } else {
            return commands.toggleWrap(this.name);
          }
        },
    };
  },

  addInputRules() {
    return [
      wrappingInputRule({
        find: /^\$callout\$$/,
        type: this.type,
        getAttributes: (match) => {
          return { type: match[1] };
        },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutWrapper);
  },
});
