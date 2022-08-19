import { Editor, Extension } from '@tiptap/core';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export interface PlaceholderOptions {
  emptyEditorClass: string;
  emptyNodeClass: string;
  placeholder: ((PlaceholderProps: { editor: Editor; node: ProsemirrorNode; pos: number }) => string) | string;
  showOnlyWhenEditable: boolean;
  showOnlyCurrent: boolean;
  includeChildren: boolean;
}

export const Placeholder = Extension.create<PlaceholderOptions>({
  name: 'placeholder',

  addOptions() {
    return {
      emptyEditorClass: 'is-editor-empty',
      emptyNodeClass: 'is-empty',
      placeholder: 'Write something …',
      showOnlyWhenEditable: true,
      showOnlyCurrent: true,
      includeChildren: false,
    };
  },

  addStorage() {
    return new Map();
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: ({ doc, selection }) => {
            const active = this.editor.isEditable || !this.options.showOnlyWhenEditable;
            const { anchor } = selection;
            const decorations: Decoration[] = [];

            if (!active) {
              return;
            }

            doc.descendants((node, pos) => {
              const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize;
              const isEmpty = !node.isLeaf && !node.childCount;

              if ((hasAnchor || !this.options.showOnlyCurrent) && isEmpty) {
                const classes = [this.options.emptyNodeClass];

                if (this.editor.isEmpty) {
                  classes.push(this.options.emptyEditorClass);
                }

                const start = pos;
                const end = pos + node.nodeSize;
                let placeholder = '';

                if (this.editor.isEditable) {
                  const key = `${start}-${end}`;

                  if (!this.editor.storage[this.name].has(key)) {
                    this.editor.storage[this.name].set(
                      key,
                      typeof this.options.placeholder === 'function'
                        ? this.options.placeholder({
                            editor: this.editor,
                            node,
                            pos,
                          })
                        : this.options.placeholder
                    );
                  }
                  placeholder = this.editor.storage[this.name].get(key);

                  setTimeout(() => {
                    this.editor.storage[this.name].delete(key);
                  }, 500);
                } else {
                  placeholder =
                    typeof this.options.placeholder === 'function'
                      ? this.options.placeholder({
                          editor: this.editor,
                          node,
                          pos,
                        })
                      : this.options.placeholder;
                }

                const decoration = Decoration.node(start, end, {
                  'class': classes.join(' '),
                  'data-placeholder': placeholder,
                });

                decorations.push(decoration);
              }

              return this.options.includeChildren;
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
