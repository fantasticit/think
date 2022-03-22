import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { AttachmentWrapper } from '../components/attachment';

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
  draggable: true,
  atom: true,

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
      },
      fileSize: {
        default: null,
      },
      fileType: {
        default: null,
      },
      fileExt: {
        default: null,
      },
      url: {
        default: null,
      },
      autoTrigger: {
        default: false,
      },
      error: {
        default: null,
      },
    };
  },
  // @ts-ignore
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
