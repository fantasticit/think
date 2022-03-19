import { Image as BuiltInImage } from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ImageWrapper } from '../components/image';

const resolveImageEl = (element) =>
  element.nodeName === 'IMG' ? element : element.querySelector('img');

export const Image = BuiltInImage.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      inline: true,
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
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageWrapper);
  },
});
