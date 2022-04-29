import { Editor } from '@tiptap/core';
import { Node, Fragment } from 'prosemirror-model';
import { copy } from 'helpers/copy';
import { safeJSONStringify } from 'helpers/json';
import { prosemirrorToMarkdown } from 'tiptap/markdown/prosemirror-to-markdown';
import { markdownToHTML } from 'tiptap/markdown/markdown-to-prosemirror/markdown-to-html';

export function copyNode(nodeOrNodeName: Node);
export function copyNode(nodeOrNodeName: string, editor: Editor);
export function copyNode(nodeOrNodeName: string | Node, editor?: Editor) {
  let targetNode: null | Node = null;

  if (typeof nodeOrNodeName === 'string') {
    const { state } = editor;
    const $pos = state.selection.$anchor;
    // @ts-ignore
    const currentNode = state.selection.node;

    if (currentNode && currentNode.type.name === nodeOrNodeName) {
      targetNode = currentNode;
    } else {
      if ($pos.depth) {
        for (let d = $pos.depth; d > 0; d--) {
          const node = $pos.node(d);
          if (node.type.name === nodeOrNodeName) {
            targetNode = node;
          }
        }
      }
    }
  } else {
    targetNode = nodeOrNodeName;
  }

  if (targetNode) {
    const toCopy = [{ text: safeJSONStringify(targetNode.toJSON()), format: 'text/node' }];

    if (targetNode.textContent) {
      toCopy.push({ text: targetNode.textContent, format: 'text/plain' });
    }

    try {
      const markdown = prosemirrorToMarkdown({ content: Fragment.from(targetNode) });
      toCopy.push({ text: markdown, format: 'text/markdown' });
      const html = markdownToHTML(markdown);
      toCopy.push({ text: html, format: 'text/html' });
    } catch (e) {}

    copy(toCopy);
  }

  return false;
}
