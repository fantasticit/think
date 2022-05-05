import { Editor, Extension } from '@tiptap/core';
import { Plugin, PluginKey, Transaction } from 'prosemirror-state';

export const scrollIntoViewPluginKey = new PluginKey('scrollIntoViewPlugin');

type TransactionWithScroll = Transaction & { scrolledIntoView: boolean };

interface IScrollIntoViewOptions {
  /**
   *
   * 将 markdown 转换为 html
   */
  onScroll: (editor: Editor) => void;
}

export const ScrollIntoView = Extension.create<IScrollIntoViewOptions>({
  name: 'scrollIntoView',

  addOptions() {
    return {
      onScroll: () => {},
    };
  },

  addProseMirrorPlugins() {
    const { editor } = this;
    return [
      new Plugin({
        key: scrollIntoViewPluginKey,
        appendTransaction: (transactions, oldState, newState) => {
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
            this.options.onScroll(editor);
            return newState.tr.scrollIntoView();
          }
        },
      }),
    ];
  },
});
