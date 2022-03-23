import { Node } from './node';

export class Status extends Node {
  type = 'status';

  matching() {
    return this.DOMNode.nodeName === 'DIV' && this.DOMNode.classList.contains('status');
  }
}
