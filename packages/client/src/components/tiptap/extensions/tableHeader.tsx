import ReactDOM from 'react-dom';
import { Button, Space } from '@douyinfe/semi-ui';
import { IconDelete, IconPlus } from '@douyinfe/semi-icons';
import { TableHeader as BuiltInTableHeader } from '@tiptap/extension-table-header';
import { Tooltip } from 'components/tooltip';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { getCellsInRow, isColumnSelected, isTableSelected, selectColumn } from '../services/table';
import { FloatMenuView } from '../views/floatMenuView';

// @flow
/* eslint-disable no-unused-vars */
import { mergeAttributes } from '@tiptap/core';
// import TableHeader from "@tiptap/extension-table-header";

export const TableHeader = BuiltInTableHeader.extend({
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

    return ['th', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addProseMirrorPlugins() {
    const extensionThis = this;

    return [
      new Plugin({
        key: new PluginKey(`${this.name}FloatMenu`),
        view: () =>
          new FloatMenuView({
            editor: this.editor,
            tippyOptions: {
              zIndex: 100,
            },
            shouldShow: ({ editor }, floatMenuView) => {
              if (!editor.isEditable) {
                return false;
              }
              const selection = editor.state.selection;
              if (isTableSelected(selection)) {
                return false;
              }
              const cells = getCellsInRow(0)(selection);

              if (cells && cells[0]) {
                const node = editor.view.nodeDOM(cells[0].pos) as HTMLElement;
                floatMenuView.setConatiner(node.parentElement.parentElement.parentElement.parentElement);
              }

              return !!cells?.some((cell, index) => isColumnSelected(index)(selection));
            },
            init: (dom, editor) => {
              dom.classList.add('table-controller-wrapper');
              ReactDOM.render(
                <Space>
                  <Tooltip content="向前插入一列">
                    <Button
                      size="small"
                      theme="borderless"
                      type="tertiary"
                      icon={<IconPlus />}
                      onClick={() => {
                        editor.chain().addColumnBefore().run();
                      }}
                    />
                  </Tooltip>
                  <Tooltip content="删除当前列">
                    <Button
                      size="small"
                      theme="borderless"
                      type="tertiary"
                      icon={<IconDelete />}
                      onClick={() => {
                        editor.chain().deleteColumn().run();
                      }}
                    />
                  </Tooltip>
                  <Tooltip content="向后插入一列" hideOnClick>
                    <Button
                      size="small"
                      theme="borderless"
                      type="tertiary"
                      icon={<IconPlus />}
                      onClick={() => {
                        editor.chain().addColumnAfter().run();
                      }}
                    />
                  </Tooltip>
                </Space>,
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
