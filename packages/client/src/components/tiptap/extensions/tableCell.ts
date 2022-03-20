import { TableCell as BuiltInTable } from '@tiptap/extension-table-cell';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import {
  getCellsInColumn,
  isRowSelected,
  isTableSelected,
  selectRow,
  selectTable,
} from '../services/table';

export const TableCell = BuiltInTable.extend({
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey(`${this.name}FloatMenu`),
        // view: () =>
        //   new FloatMenuView({
        //     editor: this.editor,
        //     // has one selected should show
        //     shouldShow: ({ editor }) => {
        //       if (!editor.isEditable) {
        //         return false;
        //       }
        //       const cells = getCellsInColumn(0)(editor.state.selection);
        //       return !!cells?.some((cell, index) =>
        //         isRowSelected(index)(editor.state.selection)
        //       );
        //     },
        //     init: (dom, editor) => {
        //       const insertTop = buttonView({
        //         id: "insert-top",
        //         name: this.options.dictionary.insertTop,
        //         icon: DoubleUp({}),
        //       });
        //       insertTop.button.addEventListener("click", () => {
        //         editor.chain().addRowBefore().run();
        //       });
        //       const insertBottom = buttonView({
        //         id: "insert-bottom",
        //         name: this.options.dictionary.insertBottom,
        //         icon: DoubleDown({}),
        //       });
        //       insertBottom.button.addEventListener("click", () => {
        //         editor.chain().addRowAfter().run();
        //       });
        //       const remove = buttonView({
        //         name: this.options.dictionary.delete,
        //         icon: Delete({}),
        //       });
        //       remove.button.addEventListener("click", () => {
        //         if (isTableSelected(editor.state.selection)) {
        //           editor.chain().deleteTable().run();
        //         } else {
        //           editor.chain().deleteRow().run();
        //         }
        //       });

        //       dom.append(insertTop.button);
        //       dom.append(insertBottom.button);
        //       dom.append(remove.button);
        //     },
        //   }),
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
                      const grip = document.createElement('a');
                      grip.classList.add('grip-table');
                      if (isTableSelected(selection)) {
                        grip.classList.add('selected');
                      }
                      grip.addEventListener('mousedown', (event) => {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        this.editor.view.dispatch(selectTable(this.editor.state.tr));
                      });
                      return grip;
                    })
                  );
                }
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    const rowSelected = isRowSelected(index)(selection);
                    const grip = document.createElement('a');
                    grip.classList.add('grip-row');
                    if (rowSelected) {
                      grip.classList.add('selected');
                    }
                    if (index === 0) {
                      grip.classList.add('first');
                    }
                    if (index === cells.length - 1) {
                      grip.classList.add('last');
                    }
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
