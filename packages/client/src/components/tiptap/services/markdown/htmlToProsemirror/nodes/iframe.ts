import { Node } from './node';

export class Iframe extends Node {
  type = 'iframe';

  matching() {
    return this.DOMNode.nodeName === 'DIV' && this.DOMNode.classList.contains('iframe');
  }
}
