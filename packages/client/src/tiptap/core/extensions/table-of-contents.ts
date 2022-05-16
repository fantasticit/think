import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TableOfContentsWrapper } from 'tiptap/core/wrappers/table-of-contents';
import { findNode, isTitleNode } from 'tiptap/prose-utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableOfContents: {
      setTableOfContents: () => ReturnType;
    };
  }
}

interface Options {
  onHasOneBeforeInsert?: () => void;
}

export const TableOfContents = Node.create<Options>({
  name: 'tableOfContents',
  group: 'block',
  atom: true,

  addOptions() {
    return {
      onHasOneBeforeInsert: () => {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'toc',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['toc', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TableOfContentsWrapper);
  },

  addCommands() {
    return {
      setTableOfContents:
        () =>
        ({ commands, editor, view }) => {
          const nodes = findNode(editor, this.name);

          if (nodes.length) {
            this.options.onHasOneBeforeInsert();
            return;
          }

          const titleNode = view.props.state.doc.content.firstChild;

          if (isTitleNode(titleNode)) {
            const pos = ((titleNode.firstChild && titleNode.firstChild.nodeSize) || 0) + 1;
            return commands.insertContentAt(pos, { type: this.name });
          }

          return commands.insertContent({
            type: this.name,
          });
        },
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ['heading'],
        attributes: {
          id: {
            default: null,
          },
        },
      },
    ];
  },
});
