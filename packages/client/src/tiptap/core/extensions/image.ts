import { Image as BuiltInImage } from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ImageWrapper } from 'tiptap/core/wrappers/image';

const resolveImageEl = (element) => (element.nodeName === 'IMG' ? element : element.querySelector('img'));

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iamge: {
      setEmptyImage: (arg: { width?: number | string }) => ReturnType;
    };
  }
}

export const Image = BuiltInImage.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      inline: false,
      content: '',
      marks: '',
      group: 'block',
      draggable: false,
      selectable: true,
      atom: true,
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: (element) => {
          const img = resolveImageEl(element);
          return img.dataset.src || img.getAttribute('src');
        },
      },
      alt: {
        default: null,
        parseHTML: (element) => {
          const img = resolveImageEl(element);

          return img.getAttribute('alt');
        },
      },
      title: {
        default: null,
      },
      width: {
        default: 'auto',
      },
      height: {
        default: 'auto',
      },
      hasTrigger: {
        default: false,
      },
      error: {
        default: null,
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setEmptyImage:
        (attrs = {}) =>
        ({ chain }) => {
          return chain().insertContent({ type: this.name, attrs }).run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageWrapper);
  },
});
