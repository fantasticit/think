import { OrderedList as BuiltInOrderedList } from '@tiptap/extension-ordered-list';
import { getMarkdownSource } from 'tiptap/prose-utils';

export const OrderedList = BuiltInOrderedList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      parens: {
        default: false,
        parseHTML: (element) => /^[0-9]+\)/.test(getMarkdownSource(element)),
      },
    };
  },
});
