import { Node, mergeAttributes, wrappingInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { DocumentReferenceWrapper } from '../components/documentReference';

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
  draggable: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      wikiId: {
        default: '',
      },
      documentId: {
        default: '',
      },
      title: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type=documentReference]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes((this.options && this.options.HTMLAttributes) || {}, HTMLAttributes)];
  },

  // @ts-ignore
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
