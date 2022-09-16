import { Editor } from '@tiptap/core';

import { getAttributes } from '../utils';

export class Node {
  editor: Editor;
  wrapper: unknown;
  type = 'node';
  DOMNode: HTMLElement;

  constructor(editor, DomNode: HTMLElement) {
    this.editor = editor;
    this.wrapper = null;
    this.DOMNode = DomNode;
  }

  matching() {
    return false;
  }

  data(): Record<string, unknown> {
    return {
      type: this.type,
      attrs: getAttributes(this.editor, this.type, this.DOMNode),
    };
  }
}
