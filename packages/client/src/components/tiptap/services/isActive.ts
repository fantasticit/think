import { EditorState } from 'prosemirror-state';

export const isListActive = (editor) => {
  return editor.isActive('bulletList') || editor.isActive('orderedList') || editor.isActive('taskList');
};

export const isTitleActive = (editor) => editor.isActive('title');

export const isMarkActive =
  (type) =>
  (state: EditorState): boolean => {
    if (!type) {
      return false;
    }

    const { from, $from, to, empty } = state.selection;

    return empty ? type.isInSet(state.storedMarks || $from.marks()) : state.doc.rangeHasMark(from, to, type);
  };
