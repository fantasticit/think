import { useState, useEffect, useCallback } from "react";
import { Command, Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

declare module "@tiptap/core" {
  interface Commands {
    tableOfContents: {
      setToc: () => Command;
    };
  }
}

const Component = ({ editor }) => {
  const [items, setItems] = useState([]);

  const handleUpdate = useCallback(() => {
    const headings = [];
    const transaction = editor.state.tr;

    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === "heading") {
        const id = `heading-${headings.length + 1}`;

        if (node.attrs.id !== id) {
          transaction.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            id,
          });
        }

        headings.push({
          level: node.attrs.level,
          text: node.textContent,
          id,
        });
      }
    });

    transaction.setMeta("addToHistory", false);
    transaction.setMeta("preventUpdate", true);

    editor.view.dispatch(transaction);

    setItems(headings);
  }, [editor]);

  useEffect(handleUpdate, []);

  useEffect(() => {
    if (!editor) {
      return null;
    }

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor]);

  return null;
};

export const Toc = Node.create({
  name: "tableOfContents",

  group: "block",

  atom: true,

  parseHTML() {
    return [
      {
        tag: "toc",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["toc", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },

  addGlobalAttributes() {
    return [
      {
        types: ["heading"],
        attributes: {
          id: {
            default: null,
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setToc:
        () =>
        ({ chain }) => {
          return chain().insertContent({ type: this.name }).run();
        },
    };
  },
});
