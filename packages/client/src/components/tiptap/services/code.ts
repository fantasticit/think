import { EditorState } from 'prosemirror-state';
// @ts-ignore
import { lowlight } from 'lowlight';
import { isMarkActive } from './isActive';

export const LANGUAGES = lowlight.listLanguages().reduce((a, language) => {
  a[language] = language;
  return a;
}, {});

export function isInCode(state: EditorState): boolean {
  if (state.schema.nodes.codeBlock) {
    const $head = state.selection.$head;
    for (let d = $head.depth; d > 0; d--) {
      if ($head.node(d).type === state.schema.nodes.codeBlock) {
        return true;
      }
    }
  }

  return isMarkActive(state.schema.marks.code)(state);
}
