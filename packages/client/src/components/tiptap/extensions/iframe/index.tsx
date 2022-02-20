import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { Input } from "@douyinfe/semi-ui";
import { Resizeable } from "components/resizeable";
import styles from "./index.module.scss";

const IframeNode = Node.create({
  name: "external-iframe",
  content: "",
  marks: "",
  group: "block",
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        "data-type": "external-iframe",
      },
    };
  },

  addAttributes() {
    return {
      width: {
        default: "100%",
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
    return [
      "iframe",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
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
});

const Render = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { url, width, height } = node.attrs;

  const onResize = (size) => {
    updateAttributes({ width: size.width, height: size.height });
  };
  const content = (
    <NodeViewContent as="div" className={styles.wrap}>
      {isEditable && (
        <div className={styles.handlerWrap}>
          <Input
            placeholder={"输入外链地址"}
            value={url}
            onChange={(url) => updateAttributes({ url })}
          ></Input>
        </div>
      )}
      {url && (
        <div
          className={styles.innerWrap}
          style={{ pointerEvents: !isEditable ? "auto" : "none" }}
        >
          <iframe src={url}></iframe>
        </div>
      )}
    </NodeViewContent>
  );

  if (!isEditable && !url) {
    return null;
  }

  return (
    <NodeViewWrapper>
      {isEditable ? (
        <Resizeable height={height} width={width} onChange={onResize}>
          {content}
        </Resizeable>
      ) : (
        <div style={{ width, height, maxWidth: "100%" }}>{content}</div>
      )}
    </NodeViewWrapper>
  );
};

export const Iframe = IframeNode.extend({
  addNodeView() {
    return ReactNodeViewRenderer(Render);
  },
});
