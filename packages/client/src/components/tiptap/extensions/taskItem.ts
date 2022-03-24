import { wrappingInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TaskItem as BuiltInTaskItem } from '@tiptap/extension-task-item';
import { Plugin } from 'prosemirror-state';
import { findParentNodeClosestToPos } from 'prosemirror-utils';
import { PARSE_HTML_PRIORITY_HIGHEST } from '../constants';
import { TaskItemWrapper } from '../components/taskItem';

const CustomTaskItem = BuiltInTaskItem.extend({
  parseHTML() {
    return [
      {
        tag: 'li.task-list-item',
        priority: PARSE_HTML_PRIORITY_HIGHEST,
      },
    ];
  },

  addInputRules() {
    return [
      ...this.parent(),
      wrappingInputRule({
        find: /^\s*([-+*])\s(\[(x|X| ?)\])\s$/,
        type: this.type,
        getAttributes: (match) => ({
          checked: 'xX'.includes(match[match.length - 1]),
        }),
      }),
    ];
  },

  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const listItem = document.createElement('li');
      const checkboxWrapper = document.createElement('span');
      const content = document.createElement('div');

      checkboxWrapper.contentEditable = 'false';

      Object.entries(this.options.HTMLAttributes).forEach(([key, value]) => {
        listItem.setAttribute(key, value);
      });

      listItem.dataset.checked = node.attrs.checked;
      listItem.append(checkboxWrapper, content);

      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        listItem.setAttribute(key, value);
      });

      return {
        dom: listItem,
        contentDOM: content,
        update: (updatedNode) => {
          if (updatedNode.type !== this.type) {
            return false;
          }

          listItem.dataset.checked = updatedNode.attrs.checked;
          return true;
        },
      };
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleClick: (view, pos, event) => {
            const state = view.state;
            const schema = state.schema;

            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
            const position = state.doc.resolve(coordinates.pos);
            const parentList = findParentNodeClosestToPos(position, function (node) {
              return node.type === schema.nodes.taskItem || node.type === schema.nodes.listItem;
            });
            if (!parentList) {
              return false;
            }
            const element = view.nodeDOM(parentList.pos) as HTMLLIElement;
            if (element.tagName.toLowerCase() !== 'li') return false;

            // 编辑模式：仅当点击 SPAN 时进行状态修改
            if (view.editable) {
              const target = event.target as HTMLElement;
              if (target.tagName.toLowerCase() !== 'span') return false;
            }

            const parentElement = element.parentElement;
            const type = parentElement && parentElement.getAttribute('data-type');
            if (!type || type.toLowerCase() !== 'tasklist') return false;

            const tr = state.tr;
            const nextValue = !(element.getAttribute('data-checked') === 'true');
            tr.setNodeMarkup(parentList.pos, schema.nodes.taskItem, {
              checked: nextValue,
            });
            view.dispatch(tr);
            return true;
          },
        },
      }),
    ];
  },
});

export const TaskItem = CustomTaskItem.configure({ nested: true });
