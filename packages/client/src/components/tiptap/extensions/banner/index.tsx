import { Node, Command, mergeAttributes } from "@tiptap/core";
import {
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { Banner as SemiBanner } from "@douyinfe/semi-ui";
import styles from "./index.module.scss";

declare module "@tiptap/core" {
  interface Commands {
    banner: {
      setBanner: () => Command;
    };
  }
}

const BannerExtension = Node.create({
  name: "banner",
  content: "block*",
  group: "block",
  defining: true,
  draggable: true,

  addAttributes() {
    return {
      type: {
        default: "info",
      },
    };
  },

  parseHTML() {
    return [{ tag: "div" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { class: "banner" },
      [
        "div",
        mergeAttributes(
          (this.options && this.options.HTMLAttributes) || {},
          HTMLAttributes
        ),
        0,
      ],
    ];
  },

  // @ts-ignore
  addCommands() {
    return {
      setBanner:
        (attributes) =>
        ({ commands, editor }) => {
          const { type = null } = editor.getAttributes(this.name);
          if (type) {
            commands.lift(this.name);
          } else {
            return commands.toggleWrap(this.name, attributes);
          }
        },
    };
  },
});

const Render = ({ node }) => {
  return (
    <NodeViewWrapper id="js-bannber-container" className={styles.wrap}>
      <SemiBanner
        type={node.attrs.type}
        description={<NodeViewContent />}
        closeIcon={null}
        fullMode={false}
      />
    </NodeViewWrapper>
  );
};

export const Banner = BannerExtension.extend({
  addNodeView() {
    return ReactNodeViewRenderer(Render);
  },
});
