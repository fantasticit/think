import { Mark } from './Mark';

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
