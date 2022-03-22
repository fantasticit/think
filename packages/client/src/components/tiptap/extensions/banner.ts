import { Node, Command, mergeAttributes, wrappingInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { BannerWrapper } from '../components/banner';
import { typesAvailable } from '../services/markdown/markdownToHTML/markdownBanner';

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

  addOptions() {
    return {
      types: typesAvailable,
      HTMLAttributes: {
        class: 'banner',
      },
    };
  },

  addAttributes() {
    return {
      type: {
        default: 'info',
        rendered: false,
        parseHTML: (element) => element.getAttribute('data-banner'),
        renderHTML: (attributes) => {
          return {
            'data-banner': attributes.type,
            'class': `banner banner-${attributes.type}`,
          };
        },
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

  renderHTML({ node, HTMLAttributes }) {
    const { class: classy } = this.options.HTMLAttributes;

    const attributes = {
      ...this.options.HTMLAttributes,
      'data-callout': node.attrs.type,
      'class': `${classy} ${classy}-${node.attrs.type}`,
    };

    return ['div', mergeAttributes(attributes, HTMLAttributes), 0];
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
