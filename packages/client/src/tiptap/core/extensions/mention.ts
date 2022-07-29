import BulitInMention from '@tiptap/extension-mention';
import { ReactRenderer } from '@tiptap/react';
import { getMentionUser } from 'services/user';
import tippy from 'tippy.js';
import { MentionList } from 'tiptap/core/wrappers/mention-list';
import { getDatasetAttribute } from 'tiptap/prose-utils';

const suggestion = {
  items: async ({ query }) => {
    const res = await getMentionUser();
    const data = (res.data || []).map((item) => item.user.name);
    return data.filter((item) => item.toLowerCase().startsWith(query.toLowerCase()));
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
};

export const Mention = BulitInMention.extend({
  addAttributes() {
    return {
      id: {
        default: '',
        parseHTML: getDatasetAttribute('id'),
      },
      label: {
        default: '',
        parseHTML: getDatasetAttribute('label'),
      },
    };
  },
}).configure({
  HTMLAttributes: {
    class: 'mention',
  },
  suggestion,
});
