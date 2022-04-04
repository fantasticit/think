import { Node } from './node';

export class BulletList extends Node {
  type = 'bulletList';

  matching() {
    return this.DOMNode.nodeName === 'UL';
  }
}
