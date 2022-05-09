import { TableCell as BuiltInTableCell } from '@tiptap/extension-table-cell';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { getCellsInColumn, selectTable, isRowSelected, isTableSelected, selectRow } from 'tiptap/prose-utils';

export const TableCell = BuiltInTableCell.extend({
  addAttributes() {
    return {
      colspan: {
        default: 1,
      },
      rowspan: {
        default: 1,
      },
      colwidth: {
        default: null,
        parseHTML: (element) => {
          const colwidth = element.getAttribute('colwidth');
          const value = colwidth ? colwidth.split(',').map((item) => parseInt(item, 10)) : null;

          return value;
        },
      },
      style: {
        default: null,
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: (state) => {
            const { doc, selection } = state;
            const decorations: Decoration[] = [];
            const cells = getCellsInColumn(0)(selection);

            if (cells) {
              cells.forEach(({ pos }, index) => {
                if (index === 0) {
                  decorations.push(
                    Decoration.widget(pos + 1, () => {
                      let className = 'grip-table';
                      const selected = isTableSelected(selection);
                      if (selected) {
                        className += ' selected';
                      }
                      const grip = document.createElement('a');
                      grip.className = className;
                      grip.addEventListener('mousedown', (event) => {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        this.editor.view.dispatch(selectTable(this.editor.state.tr));
                        // this.options.onSelectTable(state);
                      });
                      return grip;
                    })
                  );
                }
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    const rowSelected = isRowSelected(index)(selection);

                    let className = 'grip-row';
                    if (rowSelected) {
                      className += ' selected';
                    }
                    if (index === 0) {
                      className += ' first';
                    }
                    if (index === cells.length - 1) {
                      className += ' last';
                    }
                    const grip = document.createElement('a');
                    grip.className = className;
                    grip.addEventListener('mousedown', (event) => {
                      event.preventDefault();
                      event.stopImmediatePropagation();
                      this.editor.view.dispatch(selectRow(index)(this.editor.state.tr));
                    });
                    return grip;
                  })
                );
              });
            }

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
