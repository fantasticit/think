import { Node } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import { Plugin, PluginKey } from 'prosemirror-state';
import tippy from 'tippy.js';
import { EXTENSION_PRIORITY_HIGHEST } from 'tiptap/core/constants';
import { insertMenuLRUCache, QUICK_INSERT_COMMANDS, transformToCommands } from 'tiptap/core/menus/commands';
import { MenuList } from 'tiptap/core/wrappers/menu-list';

export const QuickInsertPluginKey = new PluginKey('quickInsert');
const extensionName = 'quickInsert';

export const QuickInsert = Node.create({
  name: extensionName,

  priority: EXTENSION_PRIORITY_HIGHEST,

  addOptions() {
    return {
      HTMLAttributes: {},
      suggestion: {
        char: '/',
        pluginKey: QuickInsertPluginKey,
        command: ({ editor, range, props }) => {
          const { state, dispatch } = editor.view;
          const { $head, $from, $to } = state.selection;

          // 删除快捷指令
          const end = $from.pos;
          const from = $head.nodeBefore
            ? end - $head.nodeBefore.text.substring($head.nodeBefore.text.indexOf('/')).length
            : $from.start();

          const tr = state.tr.deleteRange(from, end);
          dispatch(tr);

          props?.action(editor, props.user);
          insertMenuLRUCache.put(props.label);
          editor?.view?.focus();
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
      new Plugin({
        key: new PluginKey('evokeMenuPlaceholder'),
      }),
    ];
  },

  addStorage() {
    return {
      rect: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    };
  },
}).configure({
  suggestion: {
    items: ({ query }) => {
      const recentUsed = insertMenuLRUCache.get() as string[];
      const restCommands = QUICK_INSERT_COMMANDS.filter((command) => {
        return !('title' in command) && !('custom' in command) && !recentUsed.includes(command.label);
      });
      return [...transformToCommands(QUICK_INSERT_COMMANDS, recentUsed), ...restCommands].filter(
        (command) => !('title' in command) && command.label && command.label.startsWith(query)
      );
    },
    render: () => {
      let component;
      let popup;
      let isEditable;

      return {
        onStart: (props) => {
          isEditable = props.editor.isEditable;
          if (!isEditable) return;

          component = new ReactRenderer(MenuList, {
            props,
            editor: props.editor,
          });

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect || (() => props.editor.storage[extensionName].rect),
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          });
        },

        onUpdate(props) {
          if (!isEditable) return;

          component.updateProps(props);

          props.editor.storage[extensionName].rect = props.clientRect();

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props) {
          if (!isEditable) return;

          if (props.event.key === 'Escape') {
            popup[0].hide();
            return true;
          }
          return component.ref?.onKeyDown(props);
        },

        onExit() {
          if (!isEditable) return;
          popup[0].destroy();
          component.destroy();
        },
      };
    },
  },
});
