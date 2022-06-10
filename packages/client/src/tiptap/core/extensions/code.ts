import { Extension } from '@tiptap/core';
import BuiltInCode from '@tiptap/extension-code';
import codemark from 'prosemirror-codemark';
import { EXTENSION_PRIORITY_LOWER } from 'tiptap/core/constants';

export const Code = BuiltInCode.extend({
  excludes: null,
  /**
   * Reduce the rendering priority of the code mark to
   * ensure the bold, italic, and strikethrough marks
   * are rendered first.
   */
  priority: EXTENSION_PRIORITY_LOWER,
});

export const CodeMarkPlugin = Extension.create({
  name: 'codemarkPlugin',
  addProseMirrorPlugins() {
    return codemark({ markType: this.editor.schema.marks.code });
  },
});
