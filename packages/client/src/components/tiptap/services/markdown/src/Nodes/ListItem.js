import { Node } from './Node';
export class ListItem extends Node {
  constructor(...args) {
    super(...args);
    this.wrapper = {
      type: 'paragraph',
    };
  }

  type = 'listItem';

  matching() {
    return this.DOMNode.nodeName === 'LI';
  }

  //   data() {
  //     if (this.DOMNode.childNodes.length === 1 && this.DOMNode.childNodes[0].nodeName === 'P') {
  //       this.wrapper = null;
  //     }
  //   }
}
