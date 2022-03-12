import { Plugin, EditorState } from 'prosemirror-state';
import { Extension } from '@tiptap/core';
// @ts-ignore
import { lowlight } from 'lowlight';
import { uploadFile } from 'services/file';
import { Attachment } from './attachment';
import { Image } from './image';
import { markdownSerializer } from '../markdown';

const isMarkActive =
  (type) =>
  (state: EditorState): boolean => {
    if (!type) {
      return false;
    }

    const { from, $from, to, empty } = state.selection;

    return empty
      ? type.isInSet(state.storedMarks || $from.marks())
      : state.doc.rangeHasMark(from, to, type);
  };

export default function isInCode(state: EditorState): boolean {
  if (state.schema.nodes.codeBlock) {
    const $head = state.selection.$head;
    for (let d = $head.depth; d > 0; d--) {
      if ($head.node(d).type === state.schema.nodes.codeBlock) {
        return true;
      }
    }
  }

  return isMarkActive(state.schema.marks.code)(state);
}

const LANGUAGES = lowlight.listLanguages().reduce((a, language) => {
  a[language] = language;
  return a;
}, {});

export const acceptedMimes = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'],
};

function isMarkdown(text: string): boolean {
  // code-ish
  const fences = text.match(/^```/gm);
  if (fences && fences.length > 1) return true;

  // link-ish
  if (text.match(/\[[^]+\]\(https?:\/\/\S+\)/gm)) return true;
  if (text.match(/\[[^]+\]\(\/\S+\)/gm)) return true;

  // heading-ish
  if (text.match(/^#{1,6}\s+\S+/gm)) return true;

  // list-ish
  const listItems = text.match(/^[\d-*].?\s\S+/gm);
  if (listItems && listItems.length > 1) return true;

  return false;
}

function normalizePastedMarkdown(text: string): string {
  const CHECKBOX_REGEX = /^\s?(\[(X|\s|_|-)\]\s(.*)?)/gim;

  while (text.match(CHECKBOX_REGEX)) {
    text = text.replace(CHECKBOX_REGEX, (match) => `- ${match.trim()}`);
  }

  return text;
}

export const Paste = Extension.create({
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          // @ts-ignore
          handlePaste: async (view, event: ClipboardEvent) => {
            if (view.props.editable && !view.props.editable(view.state)) {
              return false;
            }
            if (!event.clipboardData) return false;

            const file = event.clipboardData.files[0];
            const text = event.clipboardData.getData('text/plain');
            const html = event.clipboardData.getData('text/html');
            const vscode = event.clipboardData.getData('vscode-editor-data');

            if (file) {
              event.preventDefault();
              const url = await uploadFile(file);
              let node = null;
              if (acceptedMimes.image.includes(file?.type)) {
                node = view.props.state.schema.nodes[Image.name].create({
                  src: url,
                });
              } else {
                node = view.props.state.schema.nodes[Attachment.name].create({
                  url,
                  name: file.name,
                });
              }
              const transaction = view.state.tr.replaceSelectionWith(node);
              view.dispatch(transaction);
              return true;
            }

            // 粘贴代码
            if (isInCode(view.state)) {
              event.preventDefault();
              view.dispatch(view.state.tr.insertText(text));
              return true;
            }

            const vscodeMeta = vscode ? JSON.parse(vscode) : undefined;
            const pasteCodeLanguage = vscodeMeta?.mode;

            // if (pasteCodeLanguage && pasteCodeLanguage !== "markdown") {
            //   event.preventDefault();
            //   view.dispatch(
            //     view.state.tr.replaceSelectionWith(
            //       view.state.schema.nodes.codeBlock.create({
            //         language: Object.keys(LANGUAGES).includes(vscodeMeta.mode)
            //           ? vscodeMeta.mode
            //           : null,
            //       })
            //     )
            //   );
            //   view.dispatch(view.state.tr.insertText(text));
            //   return true;
            // }

            // 处理 markdown
            if (isMarkdown(text) || html.length === 0 || pasteCodeLanguage === 'markdown') {
              event.preventDefault();
              const paste = markdownSerializer.deserialize({
                schema: view.props.state.schema,
                content: normalizePastedMarkdown(text),
              });
              const transaction = view.state.tr.replaceSelectionWith(paste);
              view.dispatch(transaction);
              return true;
            }
            return false;
          },
          // @ts-ignore
          handleDrop: async (view, event: any) => {
            if (view.props.editable && !view.props.editable(view.state)) {
              return false;
            }

            const hasFiles = event.dataTransfer.files.length > 0;
            if (!hasFiles) return false;

            event.preventDefault();

            const files = Array.from(event.dataTransfer.files);
            files.forEach(async (file: any) => {
              if (!file) {
                return;
              }
              const url = await uploadFile(file);
              let node = null;
              if (acceptedMimes.image.includes(file?.type)) {
                node = view.props.state.schema.nodes[Image.name].create({
                  src: url,
                });
              } else {
                node = view.props.state.schema.nodes[Attachment.name].create({
                  url,
                  name: file.name,
                });
              }
              const transaction = view.state.tr.replaceSelectionWith(node);
              view.dispatch(transaction);
              return true;
            });
          },
          clipboardTextSerializer: (slice) => {
            const doc = this.editor.schema.topNodeType.createAndFill(undefined, slice.content);
            if (!doc) {
              return '';
            }
            const content = markdownSerializer.serialize({
              schema: this.editor.schema,
              document: doc,
            });

            return content;
          },
        },
      }),
    ];
  },
});
