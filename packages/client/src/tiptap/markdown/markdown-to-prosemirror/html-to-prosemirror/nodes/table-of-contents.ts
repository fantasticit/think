import { Node } from './node';

export class TableOfContents extends Node {
  type = 'tableOfContents';

  matching() {
    return this.DOMNode.nodeName === 'DIV' && this.DOMNode.classList.contains('tableOfContents');
  }
}
