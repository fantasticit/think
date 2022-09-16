import { Node } from './node';

export class ListItem extends Node {
  constructor(editor, DomNode) {
    super(editor, DomNode);
    this.wrapper = {
      type: 'paragraph',
    };
  }

  type = 'listItem';

  matching() {
    return this.DOMNode.nodeName === 'LI';
  }
}
