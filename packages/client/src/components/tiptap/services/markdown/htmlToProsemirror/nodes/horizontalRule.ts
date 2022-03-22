import { Node } from './node';

export class HorizontalRule extends Node {
  type = 'horizontalRule';

  matching() {
    return this.DOMNode.nodeName === 'HR';
  }
}
