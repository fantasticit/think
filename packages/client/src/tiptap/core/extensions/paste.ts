import { Editor as CoreEditor, Extension, getSchema } from '@tiptap/core';
import { Document } from '@tiptap/extension-document';
import { safeJSONParse } from 'helpers/json';
import { toggleMark } from 'prosemirror-commands';
import { DOMParser as PMDOMParser, Fragment, Node, Schema } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import { EXTENSION_PRIORITY_HIGHEST } from 'tiptap/core/constants';
import {
  debug,
  fixHTML,
  handleFileEvent,
  isInCode,
  isInTitle,
  isMarkdown,
  isValidURL,
  normalizeMarkdown,
  safePos,
} from 'tiptap/prose-utils';

const htmlToProsemirror = (editor: CoreEditor, html, isPasteMarkdown = false) => {
  const firstNode = editor.view.state.doc.content.firstChild;
  const shouldInsertTitleText = !!(firstNode?.textContent?.length <= 0 ?? true);

  if (!shouldInsertTitleText && !isPasteMarkdown) return false;

  const parser = new window.DOMParser();
  const { body } = parser.parseFromString(fixHTML(html), 'text/html');

  const schema = getSchema(
    [].concat(
      Document,
      editor.extensionManager.extensions.filter(
        (ext) => ext.type === 'node' && !['title', 'doc', 'collaboration', 'collaborationCursor'].includes(ext.name)
      )
    )
  );

  const toPasteNode = PMDOMParser.fromSchema(schema).parse(body);
  const doc = {
    type: 'doc',
    content: toPasteNode.content.toJSON(),
  };

  let toInsertAtTitleNode = null;

  if (shouldInsertTitleText) {
    toInsertAtTitleNode = doc.content.shift();
  }

  let tr = editor.view.state.tr;

  const insertAt = isInTitle(editor.state)
    ? safePos(editor.state, firstNode.nodeSize)
    : safePos(editor.state, editor.state.selection.from - 1);

  const node = editor.state.schema.nodeFromJSON(doc);
  tr = tr.insert(insertAt, node);

  if (shouldInsertTitleText) {
    if (toInsertAtTitleNode) {
      if (['heading', 'paragraph'].includes(toInsertAtTitleNode.type)) {
        tr.insertText(toInsertAtTitleNode?.content?.[0]?.text, 1, 1);
      } else {
        tr.insert(insertAt, editor.state.schema.nodeFromJSON(toInsertAtTitleNode));
      }
    }
  }

  editor.view.dispatch(tr.scrollIntoView());
  return true;
};

interface IPasteOptions {
  /**
   *
   * 将 html 转换为 prosemirror
   */
  htmlToProsemirror: (arg: {
    editor: CoreEditor;
    schema: Schema;
    html: string;
    needTitle: boolean;
    defaultTitle?: string;
  }) => Node;

  /**
   * 将 markdown 转换为 html
   */
  markdownToHTML: (arg: string) => string;

  /**
   * 将 markdown 转换为 prosemirror 节点
   */
  markdownToProsemirror: (arg: { editor: CoreEditor; schema: Schema; content: string; needTitle: boolean }) => Node;

  /**
   * 将 prosemirror 转换为 markdown
   */
  prosemirrorToMarkdown: (arg: { content: Fragment }) => string;
}

export const Paste = Extension.create<IPasteOptions>({
  name: 'paste',
  priority: EXTENSION_PRIORITY_HIGHEST,

  addOptions() {
    return {
      htmlToProsemirror: (arg) => '',
      markdownToHTML: (arg) => arg,
      markdownToProsemirror: (arg) => arg.content,
      prosemirrorToMarkdown: (arg) => String(arg.content),
    };
  },

  addStorage() {
    return this.options;
  },

  addProseMirrorPlugins() {
    const extensionThis = this;
    const { editor } = extensionThis;

    return [
      new Plugin({
        key: new PluginKey('paste'),
        props: {
          handlePaste: (view, event: ClipboardEvent) => {
            if (view.props.editable && !view.props.editable(view.state)) {
              return false;
            }

            if (!event.clipboardData) return false;

            const files = Array.from(event.clipboardData.files);
            const text = event.clipboardData.getData('text/plain');
            const html = event.clipboardData.getData('text/html');
            const vscode = event.clipboardData.getData('vscode-editor-data');
            const node = event.clipboardData.getData('text/node');
            const markdownText = event.clipboardData.getData('text/markdown');
            const { state, dispatch } = view;

            debug(() => {
              console.group('paste');
              console.log({ text, vscode, node, markdownText, files });
              console.log(html);
              console.groupEnd();
            });

            // 直接复制节点
            if (node) {
              const json = safeJSONParse(node);
              const tr = view.state.tr;
              const selection = tr.selection;
              view.dispatch(tr.insert(selection.from - 1, view.state.schema.nodeFromJSON(json)).scrollIntoView());
              return true;
            }

            // 链接
            if (isValidURL(text)) {
              if (!state.selection.empty) {
                toggleMark(this.editor.schema.marks.link, { href: text })(state, dispatch);
                return true;
              }

              const transaction = view.state.tr
                .insertText(text, state.selection.from, state.selection.to)
                .addMark(
                  state.selection.from,
                  state.selection.to + text.length,
                  state.schema.marks.link.create({ href: text })
                );
              view.dispatch(transaction);
              return true;
            }

            // 粘贴代码
            if (isInCode(view.state)) {
              event.preventDefault();
              view.dispatch(view.state.tr.insertText(text).scrollIntoView());
              return true;
            }

            const vscodeMeta = vscode ? JSON.parse(vscode) : undefined;
            const pasteCodeLanguage = vscodeMeta?.mode;

            if (html.length > 0) {
              return htmlToProsemirror(editor, html);
            }

            const { markdownToHTML } = extensionThis.options;

            if ((markdownText || isMarkdown(text)) && markdownToHTML) {
              event.preventDefault();
              const html = markdownToHTML(normalizeMarkdown(markdownText || text));
              if (html && html.length) return htmlToProsemirror(editor, html, true);
            }

            if (files.length) {
              event.preventDefault();
              files.forEach((file) => {
                handleFileEvent({ editor, file });
              });
              return true;
            }

            return false;
          },
          handleDrop: (view, event: any) => {
            if (view.props.editable && !view.props.editable(view.state)) {
              return false;
            }

            const hasFiles = event.dataTransfer.files.length > 0;
            if (!hasFiles) return false;

            event.preventDefault();

            const files = Array.from(event.dataTransfer.files);
            if (files.length) {
              event.preventDefault();
              files.forEach((file: File) => {
                handleFileEvent({ editor, file });
              });
              return true;
            }

            return false;
          },
        },
      }),
    ];
  },
});
