import { Node, findParentNode } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import Suggestion from '@tiptap/suggestion';
import tippy from 'tippy.js';
import { MenuList } from '../wrappers/menuList';
import { EVOKE_MENU_ITEMS } from '../menus/evokeMenu';

export const EvokeMenuPluginKey = new PluginKey('evokeMenu');

export const EvokeMenu = Node.create({
  name: 'evokeMenu',

  addOptions() {
    return {
      HTMLAttributes: {},
      suggestion: {
        char: '/',
        pluginKey: EvokeMenuPluginKey,
        command: ({ editor, range, props }) => {
          const { state, dispatch } = editor.view;
          const $from = state.selection.$from;
          const tr = state.tr.deleteRange($from.start(), $from.pos);
          dispatch(tr);
          props?.command(editor);
          editor?.view?.focus();
        },
      },
    };
  },

  addProseMirrorPlugins() {
    const { editor } = this;

    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),

      new Plugin({
        key: new PluginKey('evokeMenuPlaceholder'),
        props: {
          decorations: (state) => {
            if (!editor.isEditable) return;

            const parent = findParentNode((node) => node.type.name === 'paragraph')(state.selection);
            if (!parent) {
              return;
            }

            const decorations: Decoration[] = [];
            const isEmpty = parent && parent.node.content.size === 0;
            const isSlash = parent && parent.node.textContent === '/';
            const isTopLevel = state.selection.$from.depth === 1;
            const hasOtherChildren = parent && parent.node.content.childCount > 1;

            if (isTopLevel) {
              if (isEmpty) {
                decorations.push(
                  Decoration.node(parent.pos, parent.pos + parent.node.nodeSize, {
                    'class': 'is-empty',
                    'data-placeholder': '输入 / 唤起更多',
                  })
                );
              }

              if (isSlash && !hasOtherChildren) {
                decorations.push(
                  Decoration.node(parent.pos, parent.pos + parent.node.nodeSize, {
                    'class': 'is-empty',
                    'data-placeholder': `  继续输入进行过滤`,
                  })
                );
              }

              return DecorationSet.create(state.doc, decorations);
            }
            return null;
          },
        },
      }),
    ];
  },
}).configure({
  suggestion: {
    items: ({ query }) => {
      return EVOKE_MENU_ITEMS.filter((command) => command.key.startsWith(query));
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
            getReferenceClientRect: props.clientRect,
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

        onExit(props) {
          if (!isEditable) return;

          popup[0].destroy();
          component.destroy();
        },
      };
    },
  },
});
