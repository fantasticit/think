import { Node } from './node';

export class Table extends Node {
  type = 'table';

  matching() {
    return this.DOMNode.nodeName === 'TBODY' && this.DOMNode.parentNode.nodeName === 'TABLE';
  }
}
