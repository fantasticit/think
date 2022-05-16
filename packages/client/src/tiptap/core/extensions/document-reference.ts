import { mergeAttributes, Node, wrappingInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { DocumentReferenceWrapper } from 'tiptap/core/wrappers/document-reference';
import { getDatasetAttribute } from 'tiptap/prose-utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    documentReference: {
      setDocumentReference: () => ReturnType;
    };
  }
}

export const DocumentReferenceInputRegex = /^documentReference\$$/;

export const DocumentReference = Node.create({
  name: 'documentReference',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
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
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {},
          });
        },
    };
  },

  addInputRules() {
    return [
      wrappingInputRule({
        find: DocumentReferenceInputRegex,
        type: this.type,
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DocumentReferenceWrapper);
  },
});
