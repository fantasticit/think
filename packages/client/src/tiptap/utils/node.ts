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

export function getCurrentNode(state: EditorState): Node {
  const $head = state.selection.$head;
  let node = null;

  for (let d = $head.depth; d > 0; d--) {
    node = $head.node(d);
  }

  return node;
}

export function isInCustomNode(state: EditorState, nodeName: string): boolean {
  if (!state.schema.nodes[nodeName]) return false;

  const $head = state.selection.$head;
  for (let d = $head.depth; d > 0; d--) {
    if ($head.node(d).type === state.schema.nodes[nodeName]) {
      return true;
    }
  }
}

export function isInCodeBlock(state: EditorState): boolean {
  return isInCustomNode(state, 'codeBlock');
}

export function isInTitle(state: EditorState): boolean {
  return isInCustomNode(state, 'title');
}

export function isInBanner(state: EditorState): boolean {
  return isInCustomNode(state, 'banner');
}
