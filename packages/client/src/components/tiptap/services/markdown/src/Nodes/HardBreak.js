import { Node } from './Node';

export class HardBreak extends Node {
  type = 'hardBreak';

  matching() {
    return this.DOMNode.nodeName === 'BR';
  }
}
