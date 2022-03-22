import { Node } from './Node';

export class TaskList extends Node {
  type = 'taskList';

  matching() {
    return this.DOMNode.nodeName === 'UL' && this.DOMNode.classList.contains('task-list');
  }
}
