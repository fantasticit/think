import { Node } from './node';

export class Mind extends Node {
  type = 'mind';

  matching() {
    return this.DOMNode.nodeName === 'DIV' && this.DOMNode.classList.contains('mind');
  }
}
