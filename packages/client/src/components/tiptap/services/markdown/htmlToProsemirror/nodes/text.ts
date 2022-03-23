import { Node } from './node';

export class Text extends Node {
  matching() {
    return this.DOMNode.nodeName === '#text';
  }

  data() {
    const text = this.DOMNode.nodeValue.replace(/^[\n]+/g, '');

    if (!text) {
      return null;
    }

    return {
      type: 'text',
      text: text.trim() || '\n',
    };
  }
}
