import {
  Node,
  Command,
  mergeAttributes,
  wrappingInputRule,
} from "@tiptap/core";
import {
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { Popover, TextArea, Typography, Space } from "@douyinfe/semi-ui";
import { IconHelpCircle } from "@douyinfe/semi-icons";
import katex from "katex";
import styles from "./index.module.scss";
import { useMemo } from "react";

declare module "@tiptap/core" {
  interface Commands {
    katex: {
      setKatex: () => Command;
    };
  }
}

const { Text } = Typography;

export const KatexInputRegex = /^\$\$(.+)?\$$/;

const KatexExtension = Node.create({
  name: "katex",
  group: "block",
  defining: true,
  draggable: true,

  addAttributes() {
    return {
      text: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type=katex]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        (this.options && this.options.HTMLAttributes) || {},
        HTMLAttributes
      ),
    ];
  },

  // @ts-ignore
  addCommands() {
    return {
      setKatex:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addInputRules() {
    return [
      wrappingInputRule({
        find: KatexInputRegex,
        type: this.type,
        getAttributes: (match) => {
          return { text: match[1] };
        },
      }),
    ];
  },
});

const Render = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { text } = node.attrs;
  const formatText = useMemo(() => {
    try {
      return katex.renderToString(`${text}`);
    } catch (e) {
      return text;
    }
  }, [text]);

  const content = text ? (
    <span
      contentEditable={false}
      dangerouslySetInnerHTML={{ __html: formatText }}
    ></span>
  ) : (
    <span contentEditable={false}>请输入公式</span>
  );

  return (
    <NodeViewWrapper as="div" className={styles.wrap} contentEditable={false}>
      {isEditable ? (
        <Popover
          showArrow
          content={
            <div style={{ width: 320 }}>
              <TextArea
                autofocus
                placeholder="输入公式"
                autosize
                rows={3}
                defaultValue={text}
                onChange={(v) => updateAttributes({ text: v })}
                style={{ marginBottom: 8 }}
              />
              <Text
                type="tertiary"
                link={{ href: "https://katex.org/", target: "_blank" }}
              >
                <Space>
                  <IconHelpCircle />
                  查看帮助文档
                </Space>
              </Text>
            </div>
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

export const Katex = KatexExtension.extend({
  addNodeView() {
    return ReactNodeViewRenderer(Render);
  },
});
