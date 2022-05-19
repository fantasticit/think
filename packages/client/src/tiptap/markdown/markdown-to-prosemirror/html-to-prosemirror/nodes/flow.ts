import { Node } from './node';

export class Flow extends Node {
  type = 'flow';

  matching() {
    return this.DOMNode.nodeName === 'DIV' && this.DOMNode.classList.contains('flow');
  }
}
