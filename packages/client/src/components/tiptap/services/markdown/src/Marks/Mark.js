export class Mark {
  constructor(DomNode) {
    this.type = 'mark';
    this.DOMNode = DomNode;
  }

  matching() {
    return false;
  }

  data() {
    return [];
  }
}
