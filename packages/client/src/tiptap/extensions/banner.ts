import { Node, mergeAttributes, wrappingInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { BannerWrapper } from '../wrappers/banner';
import { getDatasetAttribute } from '../utils/dataset';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    banner: {
      setBanner: (attrs) => ReturnType;
    };
  }
}

export const Banner = Node.create({
  name: 'banner',
  content: 'paragraph+',
  group: 'block',
  defining: true,
  selectable: true,

  addAttributes() {
    return {
      type: {
        default: 'info',
        rendered: false,
        parseHTML: getDatasetAttribute('type'),
        renderHTML: (attributes) => {
          return {
            'data-type': attributes.type,
            'class': `banner banner-${attributes.type}`,
          };
        },
      },
    };
  },

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'banner',
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

  addInputRules() {
    return [
      wrappingInputRule({
        find: /^:::([\dA-Za-z]*) $/,
        type: this.type,
        getAttributes: (match) => {
          return { type: match[1] };
        },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BannerWrapper);
  },
});
