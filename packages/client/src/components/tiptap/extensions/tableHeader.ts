import { TableHeader as BuiltInTableHeader } from '@tiptap/extension-table-header';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { getCellsInRow, isColumnSelected, isTableSelected, selectColumn } from '../services/table';

export const TableHeader = BuiltInTableHeader.extend({
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
        //       const selection = editor.state.selection;
        //       if (isTableSelected(selection)) {
        //         return false;
        //       }
        //       const cells = getCellsInRow(0)(selection);
        //       return !!cells?.some((cell, index) =>
        //         isColumnSelected(index)(selection)
        //       );
        //     },
        //     init: (dom, editor) => {
        //       const insertLeft = buttonView({
        //         name: this.options.dictionary.insertLeft,
        //         icon: DoubleLeft({}),
        //       });
        //       insertLeft.button.addEventListener("click", () => {
        //         editor.chain().addColumnBefore().run();
        //       });
        //       const insertRight = buttonView({
        //         name: this.options.dictionary.insertRight,
        //         icon: DoubleRight({}),
        //       });
        //       insertRight.button.addEventListener("click", () => {
        //         editor.chain().addColumnAfter().run();
        //       });
        //       const remove = buttonView({
        //         name: this.options.dictionary.delete,
        //         icon: Delete({}),
        //       });
        //       remove.button.addEventListener("click", () => {
        //         editor.chain().deleteColumn().run();
        //       });

        //       dom.append(insertLeft.button);
        //       dom.append(insertRight.button);
        //       dom.append(remove.button);
        //     },
        //   }),
        props: {
          decorations: (state) => {
            const { doc, selection } = state;
            const decorations: Decoration[] = [];
            const cells = getCellsInRow(0)(selection);

            if (cells) {
              cells.forEach(({ pos }, index) => {
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    const colSelected = isColumnSelected(index)(selection);
                    const grip = document.createElement('a');
                    grip.classList.add('grip-column');
                    if (colSelected) {
                      grip.classList.add('selected');
                    }
                    if (index === 0) {
                      grip.classList.add('first');
                    } else if (index === cells.length - 1) {
                      grip.classList.add('last');
                    }
                    grip.addEventListener('mousedown', (event) => {
                      event.preventDefault();
                      event.stopImmediatePropagation();
                      this.editor.view.dispatch(selectColumn(index)(this.editor.state.tr));
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
