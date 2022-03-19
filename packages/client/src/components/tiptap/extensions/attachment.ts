import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { AttachmentWrapper } from '../components/attachment';

export const Attachment = Node.create({
  name: 'attachment',
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
      name: {
        default: null,
      },
      url: {
        default: null,
      },
    };
  },
  // @ts-ignore
  addCommands() {
    return {
      setAttachment:
        (attrs) =>
        ({ chain }) => {
          return chain().insertContent({ type: this.name, attrs }).run();
        },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(AttachmentWrapper);
  },
});
