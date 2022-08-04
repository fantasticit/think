import { Node, ResolvedPos } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

export type ActiveNode = Readonly<{
  $pos: ResolvedPos;
  node: Node;
  el: HTMLElement;
  offset: number;
}>;

const nodeIsNotBlock = (node: Node) => !node.type.isBlock;

const nodeIsFirstChild = (pos: ResolvedPos) => {
  let parent = pos.parent;
  const node = pos.node();

  if (parent === node) {
    parent = pos.node(pos.depth - 1);
  }
  if (!parent || parent.type.name === 'doc') return false;

  return parent.firstChild === node;
};

const getDOMByPos = (view: EditorView, root: HTMLElement, $pos: ResolvedPos) => {
  const { node } = view.domAtPos($pos.pos);

  let el: HTMLElement = node as HTMLElement;
  let parent = el.parentElement;
  while (parent && parent !== root && $pos.pos === view.posAtDOM(parent, 0)) {
    el = parent;
    parent = parent.parentElement;
  }

  return el;
};

export const selectRootNodeByDom = (dom: Element, view: EditorView): ActiveNode | null => {
  const root = view.dom.parentElement;

  if (!root) return null;

  let pos = view.posAtDOM(dom, 0);

  /**
   * img 节点修正
   */
  if (dom.tagName === 'IMG') {
    pos -= 1;
  }

  if (pos === 0) return null;

  let $pos = view.state.doc.resolve(pos);
  let node = $pos.node();

  /**
   * 自定义节点修正
   */
  if (node.type.name === 'doc') {
    const nodeAtPos = view.state.doc.nodeAt(pos);

    if (nodeAtPos && nodeAtPos.type.name !== 'doc' && nodeAtPos.type.name !== 'text') {
      node = nodeAtPos;
      $pos = view.state.doc.resolve(pos);
      const el = view.nodeDOM(pos);
      return { node, $pos, el, offset: 0 };
    }
  }

  while (node && (nodeIsNotBlock(node) || nodeIsFirstChild($pos))) {
    $pos = view.state.doc.resolve($pos.before());
    node = $pos.node();
  }

  if (node.type.name.includes('table')) {
    while (node.type.name !== 'table') {
      $pos = view.state.doc.resolve($pos.before());
      node = $pos.node();
    }
  }

  $pos = view.state.doc.resolve($pos.pos - $pos.parentOffset);
  const el = getDOMByPos(view, root, $pos);

  return { node, $pos, el, offset: 1 };
};
