import { mergeAttributes } from '@tiptap/core';
import { TaskList as BuiltInTaskList } from '@tiptap/extension-task-list';
import { PARSE_HTML_PRIORITY_HIGHEST } from '../constants';

export const TaskList = BuiltInTaskList.extend({
  parseHTML() {
    return [
      {
        tag: 'ul.task-list',
        priority: PARSE_HTML_PRIORITY_HIGHEST,
      },
    ];
  },

  renderHTML({ HTMLAttributes: { numeric, ...HTMLAttributes } }) {
    return [numeric ? 'ol' : 'ul', mergeAttributes(HTMLAttributes, { 'data-type': 'taskList' }), 0];
  },
});
