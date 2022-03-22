import { wrappingInputRule, mergeAttributes } from '@tiptap/core';
import { TaskItem as BuiltInTaskItem } from '@tiptap/extension-task-item';
import { Plugin } from 'prosemirror-state';
import { findParentNodeClosestToPos } from 'prosemirror-utils';
import { PARSE_HTML_PRIORITY_HIGHEST } from '../constants';

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

  // addProseMirrorPlugins() {
  //   return [
  //     new Plugin({
  //       props: {
  //         // @ts-ignore
  //         handleClick: (view, pos, event) => {
  //           const state = view.state;
  //           const schema = state.schema;

  //           const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
  //           const position = state.doc.resolve(coordinates.pos);
  //           const parentList = findParentNodeClosestToPos(position, function (node) {
  //             return node.type === schema.nodes.taskItem || node.type === schema.nodes.listItem;
  //           });
  //           // @ts-ignore
  //           const isListClicked = event.target.tagName.toLowerCase() === 'li';
  //           if (!isListClicked || !parentList || parentList.node.type !== schema.nodes.taskItem) {
  //             return;
  //           }
  //           const tr = state.tr;
  //           tr.setNodeMarkup(parentList.pos, schema.nodes.taskItem, {
  //             checked: !parentList.node.attrs.checked,
  //           });
  //           view.dispatch(tr);
  //         },
  //       },
  //     }),
  //   ];
  // },
});

export const TaskItem = CustomTaskItem.configure({ nested: true });
