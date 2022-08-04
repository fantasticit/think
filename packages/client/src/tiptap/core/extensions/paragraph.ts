import { mergeAttributes } from '@tiptap/core';
import TitapParagraph from '@tiptap/extension-paragraph';

export const Paragraph = TitapParagraph.extend({
  draggable: true,
  selectable: true,
});
