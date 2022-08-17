import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ColumnsWrapper } from 'tiptap/core/wrappers/columns';
import { getDatasetAttribute, nodeAttrsToDataset } from 'tiptap/prose-utils';

export interface IColumnsAttrs {
  columns?: number;
}

export const Column = Node.create({
  name: 'column',
  group: 'block',
  content: '(paragraph|block)*',
  isolating: true,
  selectable: false,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'column',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[class=column]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
});
