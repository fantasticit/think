import { IUser } from '@think/domains';
import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { DocumentReferenceWrapper } from 'tiptap/core/wrappers/document-reference';
import { getDatasetAttribute } from 'tiptap/prose-utils';

export type IDocumentReferenceAttrs = {
  defaultShowPicker?: boolean;
  createUser?: IUser['id'];
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    documentReference: {
      setDocumentReference: (arg?: IDocumentReferenceAttrs) => ReturnType;
    };
  }
}

export const DocumentReference = Node.create({
  name: 'documentReference',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      organizationId: {
        default: '',
        parseHTML: getDatasetAttribute('organizationId'),
      },
      wikiId: {
        default: '',
        parseHTML: getDatasetAttribute('wikiId'),
      },
      documentId: {
        default: '',
        parseHTML: getDatasetAttribute('documentId'),
      },
      title: {
        default: '',
        parseHTML: getDatasetAttribute('title'),
      },
      defaultShowPicker: {
        default: false,
      },
      createUser: {
        default: null,
      },
    };
  },

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'documentReference',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.documentReference',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setDocumentReference:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(DocumentReferenceWrapper);
  },
});
