import { EditorView } from 'prosemirror-view';
// @see https://github.com/ueberdosis/tiptap/issues/1451
EditorView.prototype.updateState = function updateState(state) {
  if (!this.docView) return; // This prevents the matchesNode error on hot reloads
  this.updateStateInner(state, this.state.plugins != state.plugins);
};
