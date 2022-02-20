import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { Button, Tooltip } from "@douyinfe/semi-ui";
import { IconDownload } from "@douyinfe/semi-icons";
import { download } from "../../utils/download";
import styles from "./index.module.scss";

const Render = ({ node }) => {
  const { name, url } = node.attrs;

  return (
    <NodeViewWrapper as="div">
      <div className={styles.wrap}>
        <span>{name}</span>
        <span>
          <Tooltip zIndex={10000} content="下载">
            <Button
              theme={"borderless"}
              type="tertiary"
              icon={<IconDownload />}
              onClick={() => download(url, name)}
            />
          </Tooltip>
        </span>
      </div>
      <NodeViewContent></NodeViewContent>
    </NodeViewWrapper>
  );
};

export const Attachment = Node.create({
  name: "attachment",
  group: "block",
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: "attachment",
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[class=attachment]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addAttributes() {
    return {
      name: {
        default: null,
      },
      url: {
        default: null,
      },
    };
  },
  // @ts-ignore
  addCommands() {
    return {
      setAttachment:
        (attrs) =>
        ({ chain }) => {
          return chain().insertContent({ type: this.name, attrs }).run();
        },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(Render);
  },
});
