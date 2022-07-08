import TitapParagraph from '@tiptap/extension-paragraph';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { ParagraphWrapper } from '../wrappers/paragraph';

export const Paragraph = TitapParagraph.extend({
  draggable: true,

  addNodeView() {
    return ReactNodeViewRenderer(ParagraphWrapper);
  },
});
