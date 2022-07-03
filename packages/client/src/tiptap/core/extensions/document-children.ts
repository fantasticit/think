import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { DocumentChildrenWrapper } from 'tiptap/core/wrappers/document-children';
import { getDatasetAttribute } from 'tiptap/prose-utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    documentChildren: {
      setDocumentChildren: () => ReturnType;
    };
  }
}

export const DocumentChildren = Node.create({
  name: 'documentChildren',
  group: 'block',
  atom: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'documentChildren',
      },
    };
  },

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
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.documentChildren',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setDocumentChildren:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {},
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(DocumentChildrenWrapper);
  },
});
