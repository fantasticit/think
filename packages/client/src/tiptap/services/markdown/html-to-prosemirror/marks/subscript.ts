import { Mark } from './mark';

export class Subscript extends Mark {
  matching() {
    return this.DOMNode.nodeName === 'SUB';
  }

  data() {
    return {
      type: 'subscript',
    };
  }
}
