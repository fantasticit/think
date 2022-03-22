import { getAttributes } from '../utils';

export class Node {
  wrapper: unknown;
  type = 'node';
  DOMNode: HTMLElement;

  constructor(DomNode: HTMLElement) {
    this.wrapper = null;
    this.DOMNode = DomNode;
  }

  matching() {
    return false;
  }

  data(): Record<string, unknown> {
    return {
      type: this.type,
      attrs: getAttributes(this.type, this.DOMNode),
    };
  }
}
