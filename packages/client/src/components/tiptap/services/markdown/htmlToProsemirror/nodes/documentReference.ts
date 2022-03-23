import { Node } from './node';

export class DocumentReference extends Node {
  type = 'documentReference';

  matching() {
    return this.DOMNode.nodeName === 'DIV' && this.DOMNode.classList.contains('documentReference');
  }
}
