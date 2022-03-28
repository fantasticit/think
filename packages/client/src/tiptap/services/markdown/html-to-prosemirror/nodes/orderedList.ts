import { Node } from './node';

export class OrderedList extends Node {
  type = 'orderedList';

  matching() {
    return this.DOMNode.nodeName === 'OL';
  }
}
