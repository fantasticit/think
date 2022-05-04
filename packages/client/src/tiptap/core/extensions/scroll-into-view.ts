import { Extension } from '@tiptap/core';
import { Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { debounce } from 'helpers/debounce';

export const scrollIntoViewPluginKey = new PluginKey('scrollIntoViewPlugin');

type TransactionWithScroll = Transaction & { scrolledIntoView: boolean };

export const ScrollIntoView = Extension.create({
  name: 'scrollIntoView',
  addProseMirrorPlugins() {
    const { editor } = this;
    return [
      new Plugin({
        key: scrollIntoViewPluginKey,
        appendTransaction: debounce((transactions, oldState, newState) => {
          if (!transactions.length || !editor.isEditable) {
            return;
          }
          const tr = transactions[0] as TransactionWithScroll;
          if (
            (tr.docChanged || tr.storedMarksSet) &&
            !tr.scrolledIntoView &&
            tr.getMeta('scrollIntoView') !== false &&
            tr.getMeta('addToHistory') !== false
          ) {
            return newState.tr.scrollIntoView();
          }
        }, 100),
      }),
    ];
  },
});
