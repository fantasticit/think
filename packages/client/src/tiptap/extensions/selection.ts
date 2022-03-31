import { Extension } from '@tiptap/core';
import { Plugin, PluginKey, NodeSelection, TextSelection, Selection, AllSelection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { getCurrentNode, isInCodeBlock } from '../services/node';
import { EXTENSION_PRIORITY_HIGHEST } from '../constants';

export const selectionPluginKey = new PluginKey('selection');

export const getTopLevelNodesFromSelection = (selection: Selection, doc) => {
  const nodes: { node; pos: number }[] = [];
  if (selection.from !== selection.to) {
    const { from, to } = selection;
    doc.nodesBetween(from, to, (node, pos) => {
      const withinSelection = from <= pos && pos + node.nodeSize <= to;
      if (node && node.type.name !== 'paragraph' && !node.isText && withinSelection) {
        nodes.push({ node, pos });
        return false;
      }
      return true;
    });
  }
  return nodes;
};

export const getDecorations = (doc, selection: Selection): DecorationSet => {
  if (selection instanceof NodeSelection) {
    return DecorationSet.create(doc, [
      Decoration.node(selection.from, selection.to, {
        class: 'selected-node',
      }),
    ]);
  }
  if (selection instanceof TextSelection || selection instanceof AllSelection) {
    const decorations = getTopLevelNodesFromSelection(selection, doc).map(({ node, pos }) => {
      return Decoration.node(pos, pos + node.nodeSize, {
        class: 'selected-node',
      });
    });
    return DecorationSet.create(doc, decorations);
  }
  return DecorationSet.empty;
};

export const SelectionExtension = Extension.create({
  name: 'selection',
  priority: EXTENSION_PRIORITY_HIGHEST,
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: selectionPluginKey,
        props: {
          handleKeyDown(view, event) {
            /**
             * Command + A
             * Ctrl + A
             */
            if ((event.ctrlKey || event.metaKey) && (event.keyCode == 65 || event.keyCode == 97)) {
              const node = getCurrentNode(view.state);
              // 代码块
              if (isInCodeBlock(view.state)) {
                const { pos, parentOffset } = view.state.selection.$head;
                const newState = view.state;
                const next = new TextSelection(
                  newState.doc.resolve(pos - parentOffset + node.nodeSize - 2), //内容结束点
                  newState.doc.resolve(pos - parentOffset) // 内容起始点
                );
                view?.dispatch(newState.tr.setSelection(next));
                return true;
              }
            }

            return false;
          },
          handleDoubleClickOn(view, pos, node, nodePos, event) {
            if (node.type.name === 'codeBlock') {
              event.preventDefault();
              const transaction = view.state.tr.setMeta('selectNode', {
                fromPos: nodePos,
                toPos: nodePos + node.nodeSize,
                attrs: { class: 'selected-node' },
              });
              view?.dispatch(transaction);
              return false;
            }
            return true;
          },
          decorations(state) {
            return this.getState(state);
          },
        },
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(ctx) {
            if (ctx.getMeta('selectNode')) {
              const { fromPos, toPos, attrs } = ctx.getMeta('selectNode');
              return DecorationSet.create(ctx.doc, [Decoration.node(fromPos, toPos, attrs)]);
            }
            const { doc, selection } = ctx;
            const decorationSet = getDecorations(doc, selection);
            return decorationSet;
          },
        },
      }),
    ];
  },
});
