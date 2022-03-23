import { Mark } from './mark';
export class Italic extends Mark {
  matching() {
    return this.DOMNode.nodeName === 'EM';
  }

  data() {
    return {
      type: 'italic',
    };
  }
}
