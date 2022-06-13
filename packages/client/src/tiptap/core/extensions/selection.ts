import { Extension } from '@tiptap/core';
import { AllSelection, NodeSelection, Plugin, PluginKey, Selection, TextSelection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { EXTENSION_PRIORITY_HIGHEST } from 'tiptap/core/constants';
import { getCurrentNode, getNodeAtPos, isInCallout, isInCodeBlock, isTodoListNode } from 'tiptap/prose-utils';

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
    const { isEditable } = this.editor;
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
              const $head = view.state.selection.$head;
              let startPos = null;
              let endPos = null;

              // 代码块
              if (isInCodeBlock(view.state)) {
                const { pos, parentOffset } = $head;
                startPos = pos - parentOffset;
                endPos = pos - parentOffset + node.nodeSize - 2;
              }

              // 信息框
              if (isInCallout(view.state)) {
                // @ts-ignore
                const { path = [] } = $head;
                startPos = path[2] + 1;
                endPos = startPos + path[3].content.size;
              }

              if (startPos !== null && endPos !== null) {
                const newState = view.state;
                const next = new TextSelection(
                  newState.doc.resolve(endPos), //内容结束点
                  newState.doc.resolve(startPos) // 内容起始点
                );
                view?.dispatch(newState.tr.setSelection(next));
                return true;
              }
            }

            return false;
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
            const { doc, selection } = ctx;
            const decorationSet = getDecorations(doc, selection);
            return decorationSet;
          },
        },
        filterTransaction(tr, state) {
          // Prevent prosemirror's mutation observer overriding a node selection with a text selection
          // for exact same range - this was cause of being unable to change dates in collab:
          // https://product-fabric.atlassian.net/browse/ED-10645
          if (
            state.selection instanceof NodeSelection &&
            tr.selection instanceof TextSelection &&
            state.selection.from === tr.selection.from &&
            state.selection.to === tr.selection.to
          ) {
            return false;
          }
          return true;
        },
      }),
      new Plugin({
        key: new PluginKey('preventSelection'),
        props: {
          // 禁止非可编辑用户选中
          handleClick(view, pos, event) {
            if (isTodoListNode(getNodeAtPos(view.state, pos))) {
              return false;
            }

            if (!isEditable) {
              event.preventDefault();
              return true;
            }
          },
          handleKeyPress(_, event) {
            if (!isEditable) {
              event.preventDefault();
              return true;
            }
          },
          handleKeyDown(_, event) {
            if (!isEditable) {
              event.preventDefault();
              return true;
            }
          },
        },
      }),
    ];
  },
});
