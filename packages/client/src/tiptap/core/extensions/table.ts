import BuiltInTable from '@tiptap/extension-table';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { tableEditing } from 'prosemirror-tables';
import { Plugin } from 'prosemirror-state';

export const Table = BuiltInTable.extend({
  renderHTML() {
    return [
      'div',
      { class: 'scrollable-wrapper' },
      ['div', { class: 'scrollable' }, ['table', { class: 'rme-table' }, ['tbody', 0]]],
    ];
  },

  addProseMirrorPlugins() {
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

              const elements = document.getElementsByClassName('rme-table');
              const table = elements[index];
              if (!table) return;

              const element = table.parentElement;
              const shadowRight = !!(element && element.scrollWidth > element.clientWidth);

              if (shadowRight) {
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    const shadow = document.createElement('div');
                    shadow.className = 'scrollable-shadow right';
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
