import { Node } from './node';

export class Callout extends Node {
  type = 'callout';

  matching() {
    return this.DOMNode.nodeName === 'DIV' && this.DOMNode.classList.contains('callout');
  }
}
