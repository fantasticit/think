import { Node } from './Node';

export class TaskListItem extends Node {
  type = 'taskItem';

  matching() {
    return this.DOMNode.nodeName === 'LI' && this.DOMNode.classList.contains('task-list-item');
  }
}
