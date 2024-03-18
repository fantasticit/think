import { Editor } from '@tiptap/core';

export class Mark {
  editor: Editor;
  type: string;
  DOMNode: HTMLElement;

  constructor(editor, DomNode) {
    this.editor = editor;
    this.type = 'mark';
    this.DOMNode = DomNode;
  }

  matching() {
    return false;
  }

  data() {
    return {};
  }
}
