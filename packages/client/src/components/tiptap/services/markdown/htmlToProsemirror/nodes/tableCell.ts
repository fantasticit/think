import { Node } from './node';

export class TableCell extends Node {
  type = 'tableCell';

  matching() {
    return this.DOMNode.nodeName === 'TD';
  }
}
