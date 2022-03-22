import { Node } from './Node';

export class Blockquote extends Node {
  type = 'blockquote';

  matching() {
    return this.DOMNode.nodeName === 'BLOCKQUOTE';
  }

  // data() {
  //   return {
  //     type: 'blockquote',
  //   };
  // }
}
