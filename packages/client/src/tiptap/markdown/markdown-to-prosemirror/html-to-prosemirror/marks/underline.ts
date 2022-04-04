import { Mark } from './mark';

export class Underline extends Mark {
  matching() {
    return this.DOMNode.nodeName === 'U';
  }

  data() {
    return {
      type: 'underline',
    };
  }
}
