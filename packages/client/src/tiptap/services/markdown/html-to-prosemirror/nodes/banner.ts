import { Node } from './node';

export class Banner extends Node {
  type = 'banner';

  matching() {
    return this.DOMNode.nodeName === 'DIV' && this.DOMNode.classList.contains('banner');
  }
}
