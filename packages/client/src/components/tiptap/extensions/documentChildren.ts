import { Node, Command, mergeAttributes, wrappingInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { DocumentChildrenWrapper } from '../components/documentChildren';

declare module '@tiptap/core' {
  interface Commands {
    documentChildren: {
      setDocumentChildren: () => Command;
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
      color: {
        default: 'grey',
      },
      text: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type=documentChildren]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes((this.options && this.options.HTMLAttributes) || {}, HTMLAttributes),
    ];
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
