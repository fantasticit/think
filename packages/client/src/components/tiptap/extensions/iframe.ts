import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { IframeWrapper } from '../components/iframe';

export const Iframe = Node.create({
  name: 'external-iframe',
  content: '',
  marks: '',
  group: 'block',
  draggable: true,
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {
        'data-type': 'external-iframe',
      },
    };
  },

  addAttributes() {
    return {
      width: {
        default: '100%',
      },
      height: {
        default: 54,
      },
      url: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[data-type="external-iframe"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  // @ts-ignore
  addCommands() {
    return {
      insertIframe:
        (options) =>
        ({ tr, commands, chain, editor }) => {
          if (tr.selection?.node?.type?.name == this.name) {
            return commands.updateAttributes(this.name, options);
          }

          const { url } = options || {};
          const { selection } = editor.state;
          const pos = selection.$head;

          return chain()
            .insertContentAt(pos.before(), [
              {
                type: this.name,
                attrs: { url },
              },
            ])
            .run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(IframeWrapper);
  },
});
