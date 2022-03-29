import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

export function isTitleNode(node: Node): boolean {
  return node.type.name === 'title';
}

export function isBulletListNode(node: Node): boolean {
  return node.type.name === 'bulletList';
}

export function isOrderedListNode(node: Node): boolean {
  return node.type.name === 'orderedList';
}

export function isTodoListNode(node: Node): boolean {
  return node.type.name === 'taskList';
}

export function isListNode(node: Node): boolean {
  return isBulletListNode(node) || isOrderedListNode(node) || isTodoListNode(node);
}

export function isInTitle(state: EditorState): boolean {
  const $head = state.selection.$head;
  for (let d = $head.depth; d > 0; d--) {
    if ($head.node(d).type === state.schema.nodes.title) {
      return true;
    }
  }
}
