import { Node } from './node';

export class Attachment extends Node {
  type = 'attachment';

  matching() {
    return this.DOMNode.nodeName === 'DIV' && this.DOMNode.classList.contains('attachment');
  }
}
