import { mergeAttributes } from '@tiptap/core';
import { Table as BuiltInTable } from '@tiptap/extension-table';

export const Table = BuiltInTable.extend({
  addAttributes() {
    return {
      style: {
        default: null,
      },
    };
  },
  renderHTML({ node, HTMLAttributes }) {
    let totalWidth = 0;
    let fixedWidth = true;

    try {
      // use first row to determine width of table;
      // @ts-ignore
      const tr = node.content.content[0];
      tr.content.content.forEach((td) => {
        if (td.attrs.colwidth) {
          td.attrs.colwidth.forEach((col) => {
            if (!col) {
              fixedWidth = false;
              totalWidth += this.options.cellMinWidth;
            } else {
              totalWidth += col;
            }
          });
        } else {
          fixedWidth = false;
          const colspan = td.attrs.colspan ? td.attrs.colspan : 1;
          totalWidth += this.options.cellMinWidth * colspan;
        }
      });
    } catch (error) {
      fixedWidth = false;
    }

    if (fixedWidth && totalWidth > 0) {
      HTMLAttributes.style = `width: ${totalWidth}px;`;
    } else if (totalWidth && totalWidth > 0) {
      HTMLAttributes.style = `min-width: ${totalWidth}px`;
    } else {
      HTMLAttributes.style = null;
    }

    return [
      'div',
      { class: 'tableWrapper' },
      ['table', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), ['tbody', 0]],
    ];
  },
}).configure({
  resizable: true,
});
