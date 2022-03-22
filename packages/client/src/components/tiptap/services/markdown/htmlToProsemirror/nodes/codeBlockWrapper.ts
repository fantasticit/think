import { Node } from './node';

export class CodeBlockWrapper extends Node {
  matching() {
    return this.DOMNode.nodeName === 'PRE';
  }

  data() {
    return null;
  }
}
