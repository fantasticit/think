import BuiltInTable from '@tiptap/extension-table';
import { Plugin } from 'prosemirror-state';
import { tableEditing } from 'prosemirror-tables';
import { Decoration, DecorationSet } from 'prosemirror-view';

export const Table = BuiltInTable.extend({
  renderHTML() {
    return [
      'div',
      { class: 'node-table' },
      ['div', { class: `scrollable` }, ['table', { class: `think-table render-wrapper` }, ['tbody', 0]]],
    ];
  },

  addProseMirrorPlugins() {
    const { isEditable } = this.editor;

    return [
      tableEditing(),
      new Plugin({
        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations: Decoration[] = [];
            let index = 0;

            doc.descendants((node, pos) => {
              if (node.type.name !== this.name) return;

              const elements = document.getElementsByClassName('think-table');
              const table = elements[index];

              if (!table) return;

              if (!isEditable) {
                table.classList.add('is-readonly');
              }

              const element = table.parentElement;
              const shadowRight = !!(element && element.scrollWidth > element.clientWidth);

              if (shadowRight) {
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    const shadow = document.createElement('div');
                    shadow.className = `scrollable-shadow right ${isEditable ? 'is-editable' : ''}`;
                    return shadow;
                  })
                );
              }
              index++;
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
}).configure({ resizable: true });
