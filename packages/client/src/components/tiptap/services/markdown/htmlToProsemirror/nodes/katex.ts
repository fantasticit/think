import { Node } from './node';

export class Katex extends Node {
  type = 'katex';

  matching() {
    return this.DOMNode.nodeName === 'SPAN' && this.DOMNode.classList.contains('katex');
  }
}
