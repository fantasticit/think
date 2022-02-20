import { Node, mergeAttributes } from "@tiptap/core";
import Document from "@tiptap/extension-document";

const Title = Node.create({
  name: "title",
  group: "block",
  content: "text*",

  addOptions() {
    return {
      HTMLAttributes: {
        class: "title",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[class=title]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});

const TitledDocument = Document.extend({
  content: "title block*",
});

export { Document, Title, TitledDocument };
