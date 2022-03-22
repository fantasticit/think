import { Mark } from './mark';

export class Bold extends Mark {
  matching() {
    return this.DOMNode.nodeName === 'STRONG';
  }

  data() {
    return {
      type: 'bold',
    };
  }
}
