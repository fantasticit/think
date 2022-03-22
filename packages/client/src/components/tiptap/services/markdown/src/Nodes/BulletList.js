import { Node } from './Node';

export class BulletList extends Node {
  type = 'bulletList';

  matching() {
    return this.DOMNode.nodeName === 'UL';
  }

  //   data() {
  //     return {
  //       type: 'bulletList',
  //     };
  //   }
}
