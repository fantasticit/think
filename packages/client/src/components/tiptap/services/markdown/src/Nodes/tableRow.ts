import { Node } from './Node';

export class TableRow extends Node {
  type = 'tableRow';

  matching() {
    return this.DOMNode.nodeName === 'TR';
  }
}
