import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { EXTENSION_PRIORITY_HIGHEST } from 'tiptap/constants';
import { handleFileEvent, isInCode, LANGUAGES, isTitleNode } from 'tiptap/prose-utils';
import {
  isMarkdown,
  normalizePastedMarkdown,
  markdownToProsemirror,
  prosemirrorToMarkdown,
} from 'tiptap/markdown/markdown-to-prosemirror';
import { copyNode } from 'tiptap/prose-utils';
import { safeJSONParse } from 'helpers/json';

const isPureText = (content): boolean => {
  if (!content) return false;

  if (Array.isArray(content)) {
    if (content.length > 1) return false;
    return isPureText(content[0]);
  }

  const child = content['content'];
  if (child) {
    return isPureText(child);
  }

  return content['type'] === 'text';
};

export const Paste = Extension.create({
  name: 'paste',
  priority: EXTENSION_PRIORITY_HIGHEST,
  addProseMirrorPlugins() {
    const { editor } = this;

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
            if (files.length) {
              event.preventDefault();
              files.forEach((file) => {
                handleFileEvent({ editor, file });
              });
              return true;
            }

            const text = event.clipboardData.getData('text/plain');
            const html = event.clipboardData.getData('text/html');
            const vscode = event.clipboardData.getData('vscode-editor-data');
            const node = event.clipboardData.getData('text/node');
            const markdownText = event.clipboardData.getData('text/markdown');

            if (node) {
              const doc = safeJSONParse(node);
              const tr = view.state.tr;
              const selection = tr.selection;
              view.dispatch(tr.insert(selection.from - 1, view.state.schema.nodeFromJSON(doc)).scrollIntoView());
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

            if (pasteCodeLanguage && pasteCodeLanguage !== 'markdown') {
              event.preventDefault();
              view.dispatch(
                view.state.tr.replaceSelectionWith(
                  view.state.schema.nodes.codeBlock.create({
                    language: Object.keys(LANGUAGES).includes(vscodeMeta.mode) ? vscodeMeta.mode : null,
                  })
                )
              );
              view.dispatch(view.state.tr.insertText(text).scrollIntoView());
              return true;
            }

            // 处理 markdown
            if (markdownText || isMarkdown(text) || html.length === 0 || pasteCodeLanguage === 'markdown') {
              event.preventDefault();
              const firstNode = view.props.state.doc.content.firstChild;
              const hasTitle = isTitleNode(firstNode) && firstNode.content.size > 0;
              const schema = view.props.state.schema;
              const doc = markdownToProsemirror({
                schema,
                content: normalizePastedMarkdown(markdownText || text),
                hasTitle,
              });
              let tr = view.state.tr;
              const selection = tr.selection;
              view.state.doc.nodesBetween(selection.from, selection.to, (node, position) => {
                const startPosition = hasTitle ? Math.min(position, selection.from) : 0;
                const endPosition = Math.min(position + node.nodeSize, selection.to);
                tr = tr.replaceWith(startPosition, endPosition, view.state.schema.nodeFromJSON(doc));
              });
              view.dispatch(tr.scrollIntoView());
              return true;
            }

            if (text.length !== 0) {
              event.preventDefault();
              view.dispatch(view.state.tr.insertText(text));
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
          handleKeyDown(view, event) {
            /**
             * Command + C
             * Ctrl + C
             */
            if ((event.ctrlKey || event.metaKey) && event.keyCode == 67) {
              const { state } = view;
              // @ts-ignore
              const currentNode = state.selection.node;

              if (currentNode) {
                event.preventDefault();
                copyNode(currentNode);
                return true;
              }
            }

            return false;
          },
          clipboardTextSerializer: (slice) => {
            const isText = isPureText(slice.content.toJSON());

            if (isText) {
              return slice.content.textBetween(0, slice.content.size, '\n\n');
            }

            const doc = slice.content;
            if (!doc) {
              return '';
            }
            const content = prosemirrorToMarkdown({
              content: doc,
            });
            return content;
          },
        },
      }),
    ];
  },
});
