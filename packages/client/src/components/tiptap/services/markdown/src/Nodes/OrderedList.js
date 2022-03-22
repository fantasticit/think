import { Node } from './Node';

export class OrderedList extends Node {
  type = 'orderedList';

  matching() {
    return this.DOMNode.nodeName === 'OL';
  }
}
