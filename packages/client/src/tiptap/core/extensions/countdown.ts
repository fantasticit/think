import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { CountdownWrapper } from 'tiptap/core/wrappers/countdown';
import { getDatasetAttribute } from 'tiptap/prose-utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    countdown: {
      setCountdown: (attrs) => ReturnType;
    };
  }
}

export const Countdown = Node.create({
  name: 'countdown',
  content: '',
  marks: '',
  group: 'block',
  selectable: true,
  atom: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'countdown',
      },
    };
  },

  addAttributes() {
    return {
      title: {
        default: '倒计时⏰',
        parseHTML: getDatasetAttribute('title'),
      },
      date: {
        default: Date.now().valueOf() + 60 * 1000,
        parseHTML: getDatasetAttribute('date'),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[class=countdown]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setCountdown:
        (options) =>
        ({ tr, commands, chain, editor }) => {
          // @ts-ignore
          if (tr.selection?.node?.type?.name == this.name) {
            return commands.updateAttributes(this.name, options);
          }

          const { selection } = editor.state;

          return chain()
            .insertContent({
              type: this.name,
              attrs: options,
            })
            .run();
        },
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^\$countdown\$$/,
        type: this.type,
        getAttributes: () => {
          return { width: '100%' };
        },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CountdownWrapper);
  },
});
