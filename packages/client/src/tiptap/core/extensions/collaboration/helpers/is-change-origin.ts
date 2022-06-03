import { Transaction } from 'prosemirror-state';
import { ySyncPluginKey } from 'tiptap/core/thritypart/y-prosemirror/y-prosemirror';

export function isChangeOrigin(transaction: Transaction): boolean {
  return !!transaction.getMeta(ySyncPluginKey);
}
