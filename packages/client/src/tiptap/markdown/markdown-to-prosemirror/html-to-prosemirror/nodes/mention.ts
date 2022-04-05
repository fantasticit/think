import { Node } from './node';

export class Mention extends Node {
  type = 'mention';

  matching() {
    return this.DOMNode.nodeName === 'DIV' && this.DOMNode.classList.contains('mention');
  }
}
