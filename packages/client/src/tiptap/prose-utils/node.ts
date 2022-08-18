import { Editor } from '@tiptap/core';
import { Node, ResolvedPos } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

export function isTitleNode(node: Node): boolean {
  return node && node.type.name === 'title';
}

export function isBulletListNode(node: Node): boolean {
  return node && node.type.name === 'bulletList';
}

export function isOrderedListNode(node: Node): boolean {
  return node && node.type.name === 'orderedList';
}

export function isTodoListNode(node: Node): boolean {
  return node && node.type.name === 'taskList';
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

export function getNodeAtPos(state: EditorState, pos: number): Node {
  const $head = state.doc.resolve(pos);
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
  return false;
}

export function isInCodeBlock(state: EditorState): boolean {
  return isInCustomNode(state, 'codeBlock');
}

export function isInTitle(state: EditorState): boolean {
  if (state?.selection?.$head?.pos === 0) return true;
  return isInCustomNode(state, 'title');
}

export function isInCallout(state: EditorState): boolean {
  return isInCustomNode(state, 'callout');
}

export const findNode = (editor: Editor, name: string) => {
  const content = editor.getJSON();
  const queue = [content];
  const res = [];

  while (queue.length) {
    const node = queue.shift();

    if (node.type === name) {
      res.push(node);
    }

    if (node.content && node.content.length) {
      queue.push(...node.content);
    }
  }

  return res;
};
