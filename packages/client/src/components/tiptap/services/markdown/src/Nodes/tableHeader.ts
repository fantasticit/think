import { Node } from './Node';

export class TableHeader extends Node {
  type = 'tableHeader';

  matching() {
    return this.DOMNode.nodeName === 'TH';
  }
}
