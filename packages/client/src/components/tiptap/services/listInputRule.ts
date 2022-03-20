import { InputRule, wrappingInputRule } from '@tiptap/core';

/**
 * Wrapping input handler that will append the content of the last match
 *
 * @param {RegExp} find find param for the wrapping input rule
 * @param {object} type Node Type object
 * @param {*} getAttributes handler to get the attributes
 */
export function listInputRule(find, type, getAttributes = null) {
  const handler = ({ state, range, match }) => {
    const wrap = wrappingInputRule({ find, type, getAttributes });
    // @ts-ignore
    wrap.handler({ state, range, match });
    // Insert the first character after bullet if there is one
    if (match.length >= 3) {
      state.tr.insertText(match[2]);
    }
  };
  return new InputRule({ find, handler });
}
