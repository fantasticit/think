import { TaskItem as BuiltInTaskItem } from '@tiptap/extension-task-item';
import { PARSE_HTML_PRIORITY_HIGHEST } from '../constants';

export const TaskItem = BuiltInTaskItem.extend({
  addOptions() {
    return {
      nested: true,
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      checked: {
        default: false,
        parseHTML: (element) => {
          const checkbox = element.querySelector('input[type=checkbox].task-list-item-checkbox');
          // @ts-ignore
          return checkbox?.checked;
        },
        renderHTML: (attributes) => ({
          'data-checked': attributes.checked,
        }),
        keepOnSplit: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'li.task-list-item',
        priority: PARSE_HTML_PRIORITY_HIGHEST,
      },
    ];
  },
});
