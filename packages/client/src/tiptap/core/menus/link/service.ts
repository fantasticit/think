import { Editor } from 'tiptap/core';
import { isMarkActive } from 'tiptap/prose-utils';

import { triggerOpenLinkSettingModal } from '../_event';

/**
 * 新建或重设链接
 * @param editor
 */
export const createOrToggleLink = (editor: Editor) => {
  const { state } = editor;
  const isInLink = isMarkActive(state.schema.marks.link)(state);

  if (!isInLink) {
    const selection = state.selection;
    const text = state.doc.textBetween(selection.from, selection.to);
    triggerOpenLinkSettingModal(editor, { text, href: '', from: selection.from, to: selection.to });
  } else {
    // @ts-ignore
    editor.chain().focus().toggleLink().run();
  }
};
