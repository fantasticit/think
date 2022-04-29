import { Command, Extension } from '@tiptap/core';
import { sinkListItem, liftListItem } from 'prosemirror-schema-list';
import { TextSelection, AllSelection, Transaction } from 'prosemirror-state';
import { isListActive, getNodeType } from 'tiptap/prose-utils';

declare module '@tiptap/core' {
  interface Commands {
    indent: {
      indent: () => Command;
      outdent: () => Command;
    };
  }
}

export type Options = {
  type: 'space' | 'tab';
  size: number;
};

const updateIndent = (tr: Transaction, options: Options): Transaction => {
  const { doc, selection } = tr;

  if (!doc || !selection) return tr;

  if (!(selection instanceof TextSelection || selection instanceof AllSelection)) {
    return tr;
  }

  const { to } = selection;

  const text = options.type === 'space' ? Array(options.size).fill(' ').join('') : '\t';

  return tr.insertText(text, to);
};

export const Indent = Extension.create<Options>({
  name: 'indent',

  addOptions() {
    const options: Options = {
      type: 'space',
      size: 2,
    };

    return options;
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch }) => {
          if (isListActive(this.editor)) {
            const name = this.editor.can().liftListItem('taskItem') ? 'taskItem' : 'listItem';
            const type = getNodeType(name, state.schema);
            return sinkListItem(type)(state, dispatch);
          }

          const _tr = updateIndent(tr, this.options);
          if (_tr.docChanged) {
            dispatch?.(_tr);
            return true;
          }
          return false;
        },
      outdent:
        () =>
        ({ tr, state, dispatch }) => {
          if (isListActive(this.editor)) {
            const name = this.editor.can().liftListItem('taskItem') ? 'taskItem' : 'listItem';
            const type = getNodeType(name, state.schema);
            return liftListItem(type)(state, dispatch);
          }

          const _tr = updateIndent(tr, this.options);
          if (_tr.docChanged) {
            dispatch?.(_tr);
            return true;
          }
          return false;
        },
    };
  },

  // @ts-ignore
  addKeyboardShortcuts() {
    return {
      'Tab': () => {
        return this.editor.commands.indent();
      },
      'Shift-Tab': () => {
        return this.editor.commands.outdent();
      },
    };
  },
});
