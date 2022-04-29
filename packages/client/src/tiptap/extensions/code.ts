import BuiltInCode from '@tiptap/extension-code';
import { EXTENSION_PRIORITY_LOWER } from 'tiptap/constants';

export const Code = BuiltInCode.extend({
  excludes: null,
  /**
   * Reduce the rendering priority of the code mark to
   * ensure the bold, italic, and strikethrough marks
   * are rendered first.
   */
  priority: EXTENSION_PRIORITY_LOWER,
});
