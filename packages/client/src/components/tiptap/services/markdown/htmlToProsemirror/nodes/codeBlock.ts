import { Node } from './node';

export class CodeBlock extends Node {
  type = 'codeBlock';

  matching() {
    return this.DOMNode.nodeName === 'CODE' && this.DOMNode.parentNode.nodeName === 'PRE';
  }
}
