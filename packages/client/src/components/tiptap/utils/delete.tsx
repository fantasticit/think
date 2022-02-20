import { Editor } from "@tiptap/core";

export function deleteNode(nodeType, editor: Editor) {
  const { state } = editor;

  let $pos = state.selection.$anchor;

  for (let d = $pos.depth; d > 0; d--) {
    let node = $pos.node(d);
    if (node.type.name === nodeType) {
      // @ts-ignore
      if (editor.dispatchTransaction)
        // @ts-ignore
        editor.dispatchTransaction(
          state.tr.delete($pos.before(d), $pos.after(d)).scrollIntoView()
        );
      return true;
    }
  }
  return false;
}
