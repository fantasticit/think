import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { FlowWrapper } from 'tiptap/core/wrappers/flow';
import { getDatasetAttribute } from 'tiptap/prose-utils';

export interface IFlowAttrs {
  width?: number | string;
  height?: number;
  data?: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    flow: {
      setFlow: (attrs?: IFlowAttrs) => ReturnType;
    };
  }
}

const DEFAULT_XML =
  '<mxGraphModel dx="605" dy="327" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="4" value="开始节点" style="rounded=1;whiteSpace=wrap;html=1;" parent="1" vertex="1"><mxGeometry x="260" y="140" width="120" height="60" as="geometry"/></mxCell></root></mxGraphModel>';

export const Flow = Node.create({
  name: 'flow',
  group: 'block',
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      width: {
        default: null,
        parseHTML: getDatasetAttribute('width'),
      },
      height: {
        default: 240,
        parseHTML: getDatasetAttribute('height'),
      },
      data: {
        default: DEFAULT_XML,
        parseHTML: getDatasetAttribute('data'),
      },
    };
  },

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'flow',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setFlow:
        (options) =>
        ({ tr, commands, chain, editor }) => {
          options = options || {};
          options.data = options.data || DEFAULT_XML;

          // @ts-ignore
          if (tr.selection?.node?.type?.name == this.name) {
            return commands.updateAttributes(this.name, options);
          }

          const { selection } = editor.state;
          const pos = selection.$head;
          return chain()
            .insertContentAt(pos.before(), [
              {
                type: this.name,
                attrs: options,
              },
            ])
            .run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(FlowWrapper);
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^\$flow $/,
        type: this.type,
        getAttributes: (match) => {
          return { type: match[1] };
        },
      }),
    ];
  },
});
