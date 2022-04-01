import { Node } from './node';

export class Blockquote extends Node {
  type = 'blockquote';

  matching() {
    return this.DOMNode.nodeName === 'BLOCKQUOTE';
  }
}
