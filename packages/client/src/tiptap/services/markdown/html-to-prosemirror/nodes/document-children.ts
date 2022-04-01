import { Node } from './node';

export class DocumentChildren extends Node {
  type = 'documentChildren';

  matching() {
    return this.DOMNode.nodeName === 'DIV' && this.DOMNode.classList.contains('documentChildren');
  }
}
