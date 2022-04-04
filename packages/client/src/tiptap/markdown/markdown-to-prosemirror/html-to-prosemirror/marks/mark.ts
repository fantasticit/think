export class Mark {
  type: string;
  DOMNode: HTMLElement;

  constructor(DomNode) {
    this.type = 'mark';
    this.DOMNode = DomNode;
  }

  matching() {
    return false;
  }

  data() {
    return {};
  }
}
