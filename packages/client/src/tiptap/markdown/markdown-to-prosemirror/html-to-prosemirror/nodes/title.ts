import { Node } from './node';

export class Title extends Node {
  type = 'title';

  matching() {
    return this.DOMNode.nodeName === 'DIV' && this.DOMNode.classList.contains('title');
  }
}
