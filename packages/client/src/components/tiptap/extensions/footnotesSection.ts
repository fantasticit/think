import { mergeAttributes, Node } from '@tiptap/core';

export const FootnotesSection = Node.create({
  name: 'footnotesSection',

  content: 'footnoteDefinition+',

  group: 'block',

  isolating: true,

  parseHTML() {
    return [{ tag: 'section.footnotes > ol' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['ol', mergeAttributes(HTMLAttributes, { class: 'footnotes gl-font-sm' }), 0];
  },
});
