import { Node } from './node';

export class TableHeader extends Node {
  type = 'tableHeader';

  matching() {
    return this.DOMNode.nodeName === 'TH';
  }
}
