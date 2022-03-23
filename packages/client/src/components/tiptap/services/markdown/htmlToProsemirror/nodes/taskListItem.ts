import { Node } from './node';

export class TaskListItem extends Node {
  type = 'taskItem';

  matching() {
    return this.DOMNode.nodeName === 'LI' && this.DOMNode.classList.contains('task-list-item');
  }
}
