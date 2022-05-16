import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { AttachmentWrapper } from 'tiptap/core/wrappers/attachment';
import { getDatasetAttribute } from 'tiptap/prose-utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    attachment: {
      setAttachment: (attrs?: unknown) => ReturnType;
    };
  }
}

export const Attachment = Node.create({
  name: 'attachment',
  content: '',
  marks: '',
  group: 'block',
  selectable: true,
  atom: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'attachment',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[class=attachment]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addAttributes() {
    return {
      fileName: {
        default: null,
        parseHTML: getDatasetAttribute('filename'),
      },
      fileSize: {
        default: null,
        parseHTML: getDatasetAttribute('filesize'),
      },
      fileType: {
        default: null,
        parseHTML: getDatasetAttribute('filetype'),
      },
      fileExt: {
        default: null,
        parseHTML: getDatasetAttribute('fileext'),
      },
      url: {
        default: null,
        parseHTML: getDatasetAttribute('url'),
      },
      hasTrigger: {
        default: false,
        parseHTML: (element) => getDatasetAttribute('hastrigger')(element) === 'true',
      },
      error: {
        default: null,
        parseHTML: getDatasetAttribute('error'),
      },
    };
  },

  addCommands() {
    return {
      setAttachment:
        (attrs = {}) =>
        ({ chain }) => {
          return chain().insertContent({ type: this.name, attrs }).run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(AttachmentWrapper);
  },
});
