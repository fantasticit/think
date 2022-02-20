import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import findColors from "../utils/find-colors";

export const ColorHighlighter = Extension.create({
  name: "colorHighlighter",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        state: {
          init(_, { doc }) {
            return findColors(doc);
          },
          apply(transaction, oldState) {
            return transaction.docChanged
              ? findColors(transaction.doc)
              : oldState;
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});
