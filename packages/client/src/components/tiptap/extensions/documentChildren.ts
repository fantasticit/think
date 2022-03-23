import { Node, mergeAttributes, wrappingInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { DocumentChildrenWrapper } from '../components/documentChildren';
import { getDatasetAttribute } from '../services/dataset';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    documentChildren: {
      setDocumentChildren: () => ReturnType;
    };
  }
}

export const DocumentChildrenInputRegex = /^documentChildren\$$/;

export const DocumentChildren = Node.create({
  name: 'documentChildren',
  group: 'block',
  draggable: true,
  selectable: true,
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
    };
  },
  addOptions() {
    return {
      HTMLAttributes: {
        class: 'documentChildren',
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

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },
  // @ts-ignore
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

  addInputRules() {
    return [
      wrappingInputRule({
        find: DocumentChildrenInputRegex,
        type: this.type,
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DocumentChildrenWrapper);
  },
});
