import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { IframeWrapper } from '../wrappers/iframe';
import { getDatasetAttribute } from '../services/dataset';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      setIframe: (attrs) => ReturnType;
    };
  }
}

export const Iframe = Node.create({
  name: 'iframe',
  content: '',
  marks: '',
  group: 'block',
  selectable: true,
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'iframe',
      },
    };
  },

  addAttributes() {
    return {
      width: {
        default: '100%',
        parseHTML: getDatasetAttribute('width'),
      },
      height: {
        default: 66,
        parseHTML: getDatasetAttribute('height'),
      },
      url: {
        default: null,
        parseHTML: getDatasetAttribute('url'),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setIframe:
        (options) =>
        ({ tr, commands, chain, editor }) => {
          // @ts-ignore
          if (tr.selection?.node?.type?.name == this.name) {
            return commands.updateAttributes(this.name, options);
          }

          const { url } = options || { url: '' };
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
