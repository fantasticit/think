import { Node } from './node';

export class Title extends Node {
  type = 'title';

  matching() {
    return this.DOMNode.nodeName === 'P' && this.DOMNode.classList.contains('title');
  }
}
