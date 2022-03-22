import { Node } from './Node';
export class CodeBlockWrapper extends Node {
  matching() {
    return this.DOMNode.nodeName === 'PRE';
  }

  data() {
    return null;
  }
}
