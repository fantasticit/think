import ReactDOM from 'react-dom';
import { Button } from '@douyinfe/semi-ui';
import { IconDelete, IconPlus } from '@douyinfe/semi-icons';
import { mergeAttributes } from '@tiptap/core';
import { TableCell as BuiltInTableCell } from '@tiptap/extension-table-cell';
import { Tooltip } from 'components/tooltip';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import {
  getCellsInRow,
  getCellsInColumn,
  isRowSelected,
  isTableSelected,
  selectRow,
  selectTable,
} from '../services/table';
import { FloatMenuView } from '../views/float-menu';

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

  renderHTML({ HTMLAttributes }) {
    let totalWidth = 0;
    let fixedWidth = true;

    if (HTMLAttributes.colwidth) {
      HTMLAttributes.colwidth.forEach((col) => {
        if (!col) {
          fixedWidth = false;
        } else {
          totalWidth += col;
        }
      });
    } else {
      fixedWidth = false;
    }

    if (fixedWidth && totalWidth > 0) {
      HTMLAttributes.style = `width: ${totalWidth}px;`;
    } else if (totalWidth && totalWidth > 0) {
      HTMLAttributes.style = `min-width: ${totalWidth}px`;
    } else {
      HTMLAttributes.style = null;
    }

    return ['td', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addProseMirrorPlugins() {
    const extensionThis = this;
    let selectedRowIndex = -1;

    return [
      new Plugin({
        key: new PluginKey(`${this.name}FloatMenu`),
        view: () =>
          new FloatMenuView({
            editor: this.editor,
            tippyOptions: {
              zIndex: 100,
              offset: [-28, 0],
            },
            shouldShow: ({ editor }, floatMenuView) => {
              if (!editor.isEditable) {
                return false;
              }
              if (isTableSelected(editor.state.selection)) {
                return false;
              }
              const cells = getCellsInColumn(0)(editor.state.selection);
              if (selectedRowIndex > -1) {
                // 获取当前行的第一个单元格的位置
                const rowCells = getCellsInRow(selectedRowIndex)(editor.state.selection);
                if (rowCells && rowCells[0]) {
                  const node = editor.view.nodeDOM(rowCells[0].pos) as HTMLElement;
                  if (node) {
                    const el = node.querySelector('a.grip-row') as HTMLElement;
                    if (el) {
                      floatMenuView.parentNode = el;
                    }
                  }
                }
              }
              return !!cells?.some((cell, index) => isRowSelected(index)(editor.state.selection));
            },
            init: (dom, editor) => {
              dom.classList.add('bubble-memu-table-cell');
              dom.classList.add('row');
              ReactDOM.render(
                <>
                  <Tooltip content="向前插入一行" position="left">
                    <Button
                      size="small"
                      theme="borderless"
                      type="tertiary"
                      icon={<IconPlus />}
                      onClick={() => {
                        editor.chain().addRowBefore().run();
                      }}
                    />
                  </Tooltip>
                  <Tooltip content="删除当前行" position="left">
                    <Button
                      size="small"
                      theme="borderless"
                      type="tertiary"
                      icon={<IconDelete />}
                      onClick={() => {
                        editor.chain().deleteRow().run();
                      }}
                    />
                  </Tooltip>
                  <Tooltip content="向后插入一行" position="left" hideOnClick>
                    <Button
                      size="small"
                      theme="borderless"
                      type="tertiary"
                      icon={<IconPlus />}
                      onClick={() => {
                        editor.chain().addRowAfter().run();
                      }}
                    />
                  </Tooltip>
                </>,
                dom
              );
            },
          }),
        props: {
          decorations: (state) => {
            if (!extensionThis.editor.isEditable) {
              return;
            }

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
                        selectedRowIndex = -1;
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
                      selectedRowIndex = index;
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
