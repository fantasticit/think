import { Node } from "prosemirror-model";

export function isBulletListNode(node: Node): boolean {
  return node.type.name === "bulletList";
}

export function isOrderedListNode(node: Node): boolean {
  return node.type.name === "orderedList";
}

export function isTodoListNode(node: Node): boolean {
  return node.type.name === "taskList";
}

export function isListNode(node: Node): boolean {
  return (
    isBulletListNode(node) || isOrderedListNode(node) || isTodoListNode(node)
  );
}
