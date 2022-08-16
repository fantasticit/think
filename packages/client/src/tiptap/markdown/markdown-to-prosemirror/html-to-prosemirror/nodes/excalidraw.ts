import { Node } from './node';

export class Excalidraw extends Node {
  type = 'excalidraw';

  matching() {
    return this.DOMNode.nodeName === 'DIV' && this.DOMNode.classList.contains('excalidraw');
  }
}
