import BuiltInTable from '@tiptap/extension-table';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { NodeView } from 'prosemirror-view';

function updateColumns(
  node: ProseMirrorNode,
  colgroup: Element,
  table: HTMLElement,
  cellMinWidth: number,
  overrideCol?: number,
  overrideValue?: any
) {
  let totalWidth = 0;
  let fixedWidth = true;
  let nextDOM = colgroup.firstChild as HTMLElement;
  const row = node.firstChild;

  for (let i = 0, col = 0; i < row.childCount; i += 1) {
    const { colspan, colwidth } = row.child(i).attrs;

    for (let j = 0; j < colspan; j += 1, col += 1) {
      const hasWidth = overrideCol === col ? overrideValue : colwidth && colwidth[j];
      const cssWidth = hasWidth ? `${hasWidth}px` : '';

      totalWidth += hasWidth || cellMinWidth;

      if (!hasWidth) {
        fixedWidth = false;
      }

      if (!nextDOM) {
        colgroup.appendChild(document.createElement('col')).style.width = cssWidth;
      } else {
        if (nextDOM.style.width !== cssWidth) {
          nextDOM.style.width = cssWidth;
        }

        nextDOM = nextDOM.nextSibling as HTMLElement;
      }
    }
  }

  while (nextDOM) {
    const after = nextDOM.nextSibling as HTMLElement;

    nextDOM.parentNode.removeChild(nextDOM);
    nextDOM = after;
  }

  if (fixedWidth) {
    table.style.width = `${totalWidth}px`;
    table.style.minWidth = '';
  } else {
    table.style.width = '';
    table.style.minWidth = `${totalWidth}px`;
  }
}

class TableView implements NodeView {
  node: ProseMirrorNode;

  cellMinWidth: number;

  dom: HTMLElement;

  scrollDom: HTMLElement;

  table: HTMLElement;

  colgroup: HTMLElement;

  contentDOM: HTMLElement;

  constructor(node: ProseMirrorNode, cellMinWidth: number) {
    this.node = node;
    this.cellMinWidth = cellMinWidth;
    this.dom = document.createElement('div');
    this.dom.className = 'tableWrapper';

    this.scrollDom = document.createElement('div');
    this.scrollDom.className = 'scrollWrapper';
    this.dom.appendChild(this.scrollDom);

    this.table = this.scrollDom.appendChild(document.createElement('table'));
    this.colgroup = this.table.appendChild(document.createElement('colgroup'));
    updateColumns(node, this.colgroup, this.table, cellMinWidth);
    this.contentDOM = this.table.appendChild(document.createElement('tbody'));
  }

  update(node: ProseMirrorNode) {
    if (node.type !== this.node.type) {
      return false;
    }

    this.node = node;
    updateColumns(node, this.colgroup, this.table, this.cellMinWidth);

    return true;
  }

  ignoreMutation(mutation: MutationRecord | { type: 'selection'; target: Element }) {
    return (
      mutation.type === 'attributes' && (mutation.target === this.table || this.colgroup.contains(mutation.target))
    );
  }
}

export const Table = BuiltInTable.extend({
  // @ts-ignore
  addOptions() {
    return {
      HTMLAttributes: {},
      resizable: true,
      handleWidth: 5,
      cellMinWidth: 25,
      View: TableView,
      lastColumnResizable: true,
      allowTableNodeSelection: false,
    };
  },
}).configure({ resizable: true });
