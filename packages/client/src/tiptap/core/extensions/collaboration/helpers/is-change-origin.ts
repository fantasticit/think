import { ySyncPluginKey } from 'tiptap/core/thritypart/y-prosemirror/y-prosemirror';

import { Transaction } from 'prosemirror-state';

export function isChangeOrigin(transaction: Transaction): boolean {
  return !!transaction.getMeta(ySyncPluginKey);
}
