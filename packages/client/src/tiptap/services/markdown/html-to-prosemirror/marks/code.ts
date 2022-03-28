import { Mark } from './mark';

export class Code extends Mark {
  matching() {
    if (this.DOMNode.parentNode.nodeName === 'PRE') {
      return false;
    }

    return this.DOMNode.nodeName === 'CODE';
  }

  data() {
    return {
      type: 'code',
    };
  }
}
