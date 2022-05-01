import { Blockquote as BuiltInBlockquote } from '@tiptap/extension-blockquote';
import { wrappingInputRule } from '@tiptap/core';
import { getParents } from 'tiptap/prose-utils';
import { getMarkdownSource } from 'tiptap/markdown/markdown-to-prosemirror';

export const Blockquote = BuiltInBlockquote.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      multiline: {
        default: false,
        parseHTML: (element) => {
          const source = getMarkdownSource(element);
          const parentsIncludeBlockquote = getParents(element).some((p) => p.nodeName.toLowerCase() === 'blockquote');
          return source && !source.startsWith('>') && !parentsIncludeBlockquote;
        },
      },
    };
  },
  addInputRules() {
    const multilineInputRegex = /^\s*>>>\s$/gm;
    return [
      // eslint-disable-next-line no-unsafe-optional-chaining
      ...this.parent?.(),
      wrappingInputRule({
        find: multilineInputRegex,
        type: this.type,
        getAttributes: () => ({ multiline: true }),
      }),
    ];
  },
});
