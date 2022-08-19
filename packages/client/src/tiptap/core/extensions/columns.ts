import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Node as ProseMirrorNode, Transaction } from 'prosemirror-model';
import { NodeSelection, Plugin, PluginKey, State, TextSelection } from 'prosemirror-state';
import { findParentNodeOfType, findSelectedNodeOfType } from 'prosemirror-utils';
import { ColumnsWrapper } from 'tiptap/core/wrappers/columns';
import { findParentNodeClosestToPos, getDatasetAttribute, getStepRange } from 'tiptap/prose-utils';

export interface IColumnsAttrs {
  type?: 'left-right' | 'left-sidebar' | 'right-sidebar';
  columns?: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      setColumns: (attrs?: IColumnsAttrs) => ReturnType;
    };
  }
}

const ColumnsPluginKey = new PluginKey('columns');

const fixColumnSizes = (changedTr: Transaction, state: State) => {
  const columns = state.schema.nodes.columns;

  const range = getStepRange(changedTr);

  if (!range) {
    return undefined;
  }

  let change;

  changedTr.doc.nodesBetween(range.from, range.to, (node, pos) => {
    if (node.type !== columns) {
      return true;
    }

    if (node.childCount !== node.attrs.columns) {
      const json = node.toJSON();

      if (json && json.content && json.content.length) {
        change = {
          from: pos + 1,
          to: pos + node.nodeSize - 1,
          node: ProseMirrorNode.fromJSON(state.schema, {
            ...json,
            content: json.content.slice(0, node.attrs.columns),
          }),
        };
      }
    }

    return false;
  });

  return change;
};

export const Columns = Node.create({
  name: 'columns',
  group: 'block',
  content: 'column{2,}*',
  defining: true,
  selectable: true,
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      type: {
        default: 'left-right',
        parseHTML: getDatasetAttribute('type'),
      },
      columns: {
        default: 2,
        parseHTML: getDatasetAttribute('columns'),
      },
    };
  },

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'columns',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[class=columns]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `columns ${node.attrs.type}`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setColumns:
        (options) =>
        ({ state, tr, dispatch }) => {
          if (!dispatch) return;

          const currentNodeWithPos = findParentNodeClosestToPos(
            state.selection.$from,
            (node) => node.type.name === this.name
          );

          if (currentNodeWithPos) {
            let nodes: Array<ProseMirrorNode> = [];
            currentNodeWithPos.node.descendants((node, _, parent) => {
              if (parent?.type.name === 'column') {
                nodes.push(node);
              }
            });

            nodes = nodes.reverse().filter((node) => node.content.size > 0);

            const resolvedPos = tr.doc.resolve(currentNodeWithPos.pos);
            const sel = new NodeSelection(resolvedPos);

            tr = tr.setSelection(sel);
            nodes.forEach((node) => (tr = tr.insert(currentNodeWithPos.pos, node)));
            tr = tr.deleteSelection();
            dispatch(tr);

            return true;
          }

          const { schema } = state;
          const { columns: n = 2 } = options;
          const selectionContent = tr.selection.content().toJSON();
          const firstColumn = {
            type: 'column',
            content: selectionContent ? selectionContent.content : [{ type: 'paragraph', content: [] }],
          };
          const otherColumns = Array.from({ length: n - 1 }, () => ({
            type: 'column',
            content: [{ type: 'paragraph', content: [] }],
          }));
          const columns = { type: this.name, content: [firstColumn, ...otherColumns] };
          const newNode = ProseMirrorNode.fromJSON(schema, columns);
          newNode.attrs = options;
          const offset = tr.selection.anchor + 1;

          dispatch(
            tr
              .replaceSelectionWith(newNode)
              .scrollIntoView()
              .setSelection(TextSelection.near(tr.doc.resolve(offset)))
          );

          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: ColumnsPluginKey,
        state: {
          init: (_, state) => {
            const maybeColumns = findParentNodeOfType(state.schema.nodes.columns)(state.selection);

            return {
              pos: maybeColumns ? maybeColumns.pos : null,
              selectedColumns: maybeColumns ? maybeColumns.node : null,
            };
          },
          apply: (tr, pluginState, _oldState, newState) => {
            if (tr.docChanged || tr.selectionSet) {
              const columns = newState.schema.nodes.columns;

              const maybeColumns =
                findParentNodeOfType(columns)(newState.selection) ||
                findSelectedNodeOfType([columns])(newState.selection);

              const newPluginState = {
                ...pluginState,
                pos: maybeColumns ? maybeColumns.pos : null,
                selectedColumns: maybeColumns ? maybeColumns.node : null,
              };

              return newPluginState;
            }
            return pluginState;
          },
        },

        appendTransaction: (transactions, _oldState, newState) => {
          const changes = [];

          transactions.forEach((prevTr) => {
            changes.forEach((change) => {
              return {
                from: prevTr.mapping.map(change.from),
                to: prevTr.mapping.map(change.to),
                node: change.node,
              };
            });

            if (!prevTr.docChanged) {
              return;
            }

            const change = fixColumnSizes(prevTr, newState);

            if (change) {
              changes.push(change);
            }
          });

          if (changes.length) {
            const tr = newState.tr;
            const selection = newState.selection.toJSON();

            changes.forEach((change) => {
              tr.replaceRangeWith(change.from, change.to, change.node);
            });

            if (tr.docChanged) {
              const { pos, selectedColumns } = ColumnsPluginKey.getState(newState);

              if (pos !== null && selectedColumns != null) {
                let endOfColumns = pos - 1;

                for (let i = 0; i < selectedColumns?.attrs?.columns; i++) {
                  endOfColumns += selectedColumns?.content?.content?.[i]?.nodeSize;
                }

                const selectionPos$ = tr.doc.resolve(endOfColumns);

                tr.setSelection(
                  selection instanceof NodeSelection
                    ? new NodeSelection(selectionPos$)
                    : new TextSelection(selectionPos$)
                );
              }

              tr.setMeta('addToHistory', false);
              return tr;
            }
          }

          return;
        },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnsWrapper);
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^\$columns\$$/,
        type: this.type,
        getAttributes: () => {
          return { type: 'left-right', columns: 2 };
        },
      }),
    ];
  },
});
