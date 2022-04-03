import { Node } from './node';

export class Countdown extends Node {
  type = 'countdown';

  matching() {
    return this.DOMNode.nodeName === 'DIV' && this.DOMNode.classList.contains('countdown');
  }
}
