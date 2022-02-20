import { Node, mergeAttributes } from "@tiptap/core";

export const Div = Node.create({
  name: "div",
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  content: "block*",
  group: "block",
  defining: true,
  parseHTML() {
    return [{ tag: "div" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  //  @ts-ignore
  addCommands() {
    return {
      setDiv:
        (attributes) =>
        ({ commands }) => {
          return commands.wrapIn("div", attributes);
        },
      toggleDiv:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleWrap("div", attributes);
        },
      unsetDiv:
        (attributes) =>
        ({ commands }) => {
          return commands.lift("div");
        },
    };
  },
});
