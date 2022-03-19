import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { markdownSerializer } from '../services/serializer';
import { EXTENSION_PRIORITY_HIGHEST } from '../constants';

const TEXT_FORMAT = 'text/plain';
const HTML_FORMAT = 'text/html';
const VS_CODE_FORMAT = 'vscode-editor-data';

export const PasteMarkdown = Extension.create({
  name: 'pasteMarkdown',
  priority: EXTENSION_PRIORITY_HIGHEST,
  // @ts-ignore
  addCommands() {
    return {
      pasteMarkdown: (markdown) => () => {
        const { editor } = this;
        const { state, view } = editor;
        const { tr, selection } = state;

        const document = markdownSerializer.deserialize({
          schema: view.props.state.schema,
          content: markdown,
        });

        // tr.replaceWith(selection.from - 1, selection.to, document.content);
        // view.dispatch(tr);
        const transaction = view.state.tr.replaceSelectionWith(document);
        view.dispatch(transaction);
        return true;
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('pasteMarkdown'),
        props: {
          handlePaste: (_, event) => {
            const { clipboardData } = event;
            const content = clipboardData.getData(TEXT_FORMAT);
            const hasHTML = clipboardData.types.some((type) => type === HTML_FORMAT);
            const hasVsCode = clipboardData.types.some((type) => type === VS_CODE_FORMAT);
            const vsCodeMeta = hasVsCode ? JSON.parse(clipboardData.getData(VS_CODE_FORMAT)) : {};
            const language = vsCodeMeta.mode;

            if (!content || (hasHTML && !hasVsCode) || (hasVsCode && language !== 'markdown')) {
              return false;
            }

            // @ts-ignore
            this.editor.commands.pasteMarkdown(content);
            return true;
          },
          clipboardTextSerializer: (slice) => {
            const doc = this.editor.schema.topNodeType.createAndFill(undefined, slice.content);
            if (!doc) {
              return '';
            }
            const content = markdownSerializer.serialize({
              schema: this.editor.schema,
              content: doc,
            });

            return content;
          },
        },
      }),
    ];
  },
});
