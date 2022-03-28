import { Extension } from '@tiptap/core';
import { Plugin, PluginKey, NodeSelection, TextSelection, Selection, AllSelection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
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
          decorations(state) {
            const { doc, selection } = state;
            const decorationSet = getDecorations(doc, selection);
            return decorationSet;
          },
        },
      }),
    ];
  },
});
