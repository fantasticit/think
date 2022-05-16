import { Node } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import { Plugin, PluginKey } from 'prosemirror-state';
import tippy from 'tippy.js';
import { EXTENSION_PRIORITY_HIGHEST } from 'tiptap/core/constants';
import { EmojiList } from 'tiptap/core/wrappers/emoji-list';
import { emojiSearch, emojisToName } from 'tiptap/core/wrappers/emoji-list/emojis';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    emoji: {
      setEmoji: (emoji: { name: string; emoji: string }) => ReturnType;
    };
  }
}

export const EmojiPluginKey = new PluginKey('emoji');
export { emojisToName };
export const Emoji = Node.create({
  name: 'emoji',
  content: 'text*',

  priority: EXTENSION_PRIORITY_HIGHEST,

  addOptions() {
    return {
      HTMLAttributes: {},
      suggestion: {
        char: ':',
        pluginKey: EmojiPluginKey,
        command: ({ editor, range, props }) => {
          editor
            .chain()
            .focus()
            .insertContentAt(range, props.emoji + ' ')
            .run();
        },
      },
    };
  },

  addCommands() {
    return {
      setEmoji:
        (emojiObject) =>
        ({ commands }) => {
          return commands.insertContent(emojiObject.emoji + ' ');
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
        key: new PluginKey('emojiPlaceholder'),
        props: {
          // decorations: (state) => {
          //   if (!editor.isEditable) return;
          //   const parent = findParentNode((node) => node.type.name === 'paragraph')(state.selection);
          //   if (!parent) {
          //     return;
          //   }
          //   const decorations: Decoration[] = [];
          //   const isEmpty = parent && parent.node.content.size === 0;
          //   const isSlash = parent && parent.node.textContent === ':';
          //   const isTopLevel = state.selection.$from.depth === 1;
          //   if (isTopLevel) {
          //     if (isSlash) {
          //       decorations.push(
          //         Decoration.node(parent.pos, parent.pos + parent.node.nodeSize, {
          //           'class': 'placeholder',
          //           'data-placeholder': `  继续输入进行过滤`,
          //         })
          //       );
          //     }
          //     return DecorationSet.create(state.doc, decorations);
          //   }
          //   return null;
          // },
        },
      }),
    ];
  },
}).configure({
  suggestion: {
    items: ({ query }) => {
      return emojiSearch(query);
    },
    render: () => {
      let component;
      let popup;
      let isEditable;

      return {
        onStart: (props) => {
          isEditable = props.editor.isEditable;
          if (!isEditable) return;

          component = new ReactRenderer(EmojiList, {
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

        onExit() {
          if (!isEditable) return;

          popup[0].destroy();
          component.destroy();
        },
      };
    },
  },
});
