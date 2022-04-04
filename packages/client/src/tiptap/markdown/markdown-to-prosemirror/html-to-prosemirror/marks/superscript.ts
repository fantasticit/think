import { Mark } from './mark';

export class Superscript extends Mark {
  matching() {
    return this.DOMNode.nodeName === 'SUP';
  }

  data() {
    return {
      type: 'superscript',
    };
  }
}
