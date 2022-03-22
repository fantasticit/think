import { Node } from './Node';
export class Heading extends Node {
  type = 'heading';

  getLevel() {
    const matches = this.DOMNode.nodeName.match(/^H([1-6])/);
    return matches ? matches[1] : null;
  }

  matching() {
    return Boolean(this.getLevel());
  }

  //   data() {
  //     return {
  //       type: 'heading',
  //       attrs: {
  //         level: this.getLevel(),
  //       },
  //     };
  //   }
}
