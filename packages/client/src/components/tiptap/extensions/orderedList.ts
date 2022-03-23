import { OrderedList as BuiltInOrderedList } from '@tiptap/extension-ordered-list';
import { getMarkdownSource } from '../services/markdown';

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
