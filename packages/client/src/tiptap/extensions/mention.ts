import BulitInMention from '@tiptap/extension-mention';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { getUsers } from 'services/user';
import { MentionList } from '../wrappers/mention-list';

const suggestion = {
  items: async ({ query }) => {
    const res = await getUsers();
    const data = res.map((item) => item.name);
    return data.filter((item) => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5);
  },

  render: () => {
    let component;
    let popup;

    return {
      onStart: (props) => {
        component = new ReactRenderer(MentionList, {
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

  command: ({ editor, range, props }) => {
    // increase range.to by one when the next node is of type "text"
    // and starts with a space character
    const nodeAfter = editor.view.state.selection.$to.nodeAfter;
    const overrideSpace = nodeAfter?.text?.startsWith(' ');

    if (overrideSpace) {
      range.to += 1;
    }

    console.log('mention', props);

    editor
      .chain()
      .focus()
      .insertContentAt(range, [
        {
          type: BulitInMention.name,
          attrs: props,
        },
        {
          type: 'text',
          text: ' ',
        },
      ])
      .run();
  },
};

export const Mention = BulitInMention.configure({
  HTMLAttributes: {
    class: 'mention',
  },
  suggestion,
});
