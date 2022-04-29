import { Editor } from '@tiptap/core';

export function deleteNode(nodeType: string, editor: Editor) {
  const { state } = editor;
  const $pos = state.selection.$anchor;

  if ($pos.depth) {
    for (let d = $pos.depth; d > 0; d--) {
      const node = $pos.node(d);
      if (node.type.name === nodeType) {
        // @ts-ignore
        if (editor.dispatchTransaction)
          // @ts-ignore
          editor.dispatchTransaction(state.tr.delete($pos.before(d), $pos.after(d)).scrollIntoView());
        return true;
      }
    }
  } else {
    // @ts-ignore
    const node = state.selection.node;
    if (node && node.type.name === nodeType) {
      editor.chain().deleteSelection().run();
    }
  }

  return false;
}
