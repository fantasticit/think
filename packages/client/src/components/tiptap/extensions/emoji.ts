import { Node } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import { PluginKey } from 'prosemirror-state';
import Suggestion from '@tiptap/suggestion';
import tippy from 'tippy.js';
import { EmojiList } from '../components/emojiList';
import { emojiSearch, emojisToName } from '../components/emojiList/emojis';

export const EmojiPluginKey = new PluginKey('emoji');
export { emojisToName };
export const Emoji = Node.create({
  name: 'emoji',
  content: 'text*',

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

  // @ts-ignore
  addCommands() {
    return {
      emoji:
        (emojiObject) =>
        ({ commands }) => {
          return commands.insertContent(emojiObject.emoji + ' ');
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
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

      return {
        onStart: (props) => {
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
          component.updateProps(props);
          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props) {
          if (props.event.key === 'Escape') {
            popup[0].hide();
            return true;
          }
          return component.ref?.onKeyDown(props);
        },

        onExit() {
          popup[0].destroy();
          component.destroy();
        },
      };
    },
  },
});
