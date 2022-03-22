import { getAttributes } from '../utils';

export class Node {
  wrapper: null;
  type = 'node';
  DOMNode: HTMLElement;

  constructor(DomNode: HTMLElement) {
    this.wrapper = null;
    this.DOMNode = DomNode;
  }

  matching() {
    return false;
  }

  data() {
    return {
      type: this.type,
      attrs: getAttributes(this.type, this.DOMNode),
    };
  }
}
