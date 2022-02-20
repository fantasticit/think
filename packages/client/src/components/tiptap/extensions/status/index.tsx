import { Node, Command, mergeAttributes } from "@tiptap/core";
import {
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { Space, Popover, Tag, Input } from "@douyinfe/semi-ui";
import styles from "./index.module.scss";

declare module "@tiptap/core" {
  interface Commands {
    status: {
      setStatus: () => Command;
    };
  }
}

const StatusExtension = Node.create({
  name: "status",
  content: "text*",
  group: "inline",
  inline: true,

  addAttributes() {
    return {
      color: {
        default: "grey",
      },
      text: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-type=status]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(
        (this.options && this.options.HTMLAttributes) || {},
        HTMLAttributes
      ),
    ];
  },

  // @ts-ignore
  addCommands() {
    return {
      setStatus:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});

const Render = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { color, text } = node.attrs;
  const content = <Tag color={color}>{text || "设置状态"}</Tag>;

  return (
    <NodeViewWrapper as="span" className={styles.wrap}>
      {isEditable ? (
        <Popover
          showArrow
          content={
            <>
              <div style={{ marginBottom: 8 }}>
                <Input
                  autofocus
                  placeholder="输入状态"
                  onChange={(v) => updateAttributes({ text: v })}
                />
              </div>
              <Space>
                {["grey", "red", "green", "orange", "purple", "teal"].map(
                  (color) => {
                    return (
                      <Tag
                        key={color}
                        style={{ width: 24, height: 24, cursor: "pointer" }}
                        type="solid"
                        // @ts-ignore
                        color={color}
                        onClick={() => updateAttributes({ color })}
                      ></Tag>
                    );
                  }
                )}
              </Space>
            </>
          }
          trigger="click"
        >
          {content}
        </Popover>
      ) : (
        content
      )}
      <NodeViewContent></NodeViewContent>
    </NodeViewWrapper>
  );
};

export const Status = StatusExtension.extend({
  addNodeView() {
    return ReactNodeViewRenderer(Render);
  },
});
