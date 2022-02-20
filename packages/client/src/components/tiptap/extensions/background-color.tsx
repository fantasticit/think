import { Extension } from "@tiptap/core";
import "@tiptap/extension-text-style";

export type ColorOptions = {
  types: string[];
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    backgroundColor: {
      /**
       * Set the text color
       */
      setBackgroundColor: (color: string) => ReturnType;
      /**
       * Unset the text color
       */
      unsetBackgroundColor: () => ReturnType;
    };
  }
}

export const BackgroundColor = Extension.create<ColorOptions>({
  name: "backgroundColor",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: (element) =>
              element.style.backgroundColor.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) {
                return {};
              }

              return {
                style: `background-color: ${attributes.backgroundColor}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setBackgroundColor:
        (color) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { backgroundColor: color }).run();
        },
      unsetBackgroundColor:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { backgroundColor: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});
