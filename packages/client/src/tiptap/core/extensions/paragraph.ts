import { mergeAttributes } from '@tiptap/core';
import TitapParagraph from '@tiptap/extension-paragraph';

export const Paragraph = TitapParagraph.extend({
  selectable: true,
});
