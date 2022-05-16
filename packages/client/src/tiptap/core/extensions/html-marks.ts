import { Mark, markInputRule, mergeAttributes } from '@tiptap/core';
import { PARSE_HTML_PRIORITY_LOWEST } from 'tiptap/core/constants';
import { extractMarkAttributesFromMatch, markInputRegex } from 'tiptap/prose-utils';

export const marks = [{ name: 'underline', tag: 'u' }];

const attrs = {
  time: ['datetime'],
  abbr: ['title'],
  span: ['dir'],
  bdo: ['dir'],
};

export const HTMLMarks = marks.slice(1).map(({ name, tag }) =>
  Mark.create({
    name,
    tag,
    inclusive: false,
    addOptions() {
      return {
        HTMLAttributes: {},
      };
    },
    addAttributes() {
      return (attrs[name] || []).reduce(
        (acc, attr) => ({
          ...acc,
          [attr]: {
            default: null,
            parseHTML: (element) => element.getAttribute(attr),
          },
        }),
        {}
      );
    },

    parseHTML() {
      return [{ tag: tag, priority: PARSE_HTML_PRIORITY_LOWEST }];
    },

    renderHTML({ HTMLAttributes }) {
      return [tag, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },

    addInputRules() {
      return [
        markInputRule({
          find: markInputRegex(tag),
          type: this.type,
          getAttributes: extractMarkAttributesFromMatch,
        }),
      ];
    },
  })
);
