import { getNodeType } from '@tiptap/core';
import { TaskList as BuiltInTaskList } from '@tiptap/extension-task-list';
import { liftListItem } from 'prosemirror-schema-list';
import { findParentNodeClosestToPos } from 'prosemirror-utils';
import { PARSE_HTML_PRIORITY_HIGHEST } from 'tiptap/core/constants';

export const TaskList = BuiltInTaskList.extend({
  parseHTML() {
    return [
      {
        tag: 'ul.task-list',
        priority: PARSE_HTML_PRIORITY_HIGHEST,
      },
    ];
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Backspace: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;
        const maybeTask = findParentNodeClosestToPos($from, (node) => node.type.name === this.name);

        if (maybeTask && maybeTask.node.childCount === 1 && !maybeTask.node.textContent) {
          const name = this.editor.can().liftListItem('taskItem') ? 'taskItem' : 'listItem';
          const type = getNodeType(name, editor.view.state.schema);
          return liftListItem(type)(editor.view.state, editor.view.dispatch);
        }

        return false;
      },
    };
  },
});
