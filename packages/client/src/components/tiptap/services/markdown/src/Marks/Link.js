import { Mark } from './Mark';
export class Link extends Mark {
  matching() {
    return this.DOMNode.nodeName === 'A';
  }

  data() {
    return {
      type: 'link',
      attrs: {
        href: this.DOMNode.getAttribute('href'),
      },
    };
  }
}
