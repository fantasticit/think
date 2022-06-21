import { Toast } from '@douyinfe/semi-ui';
import { safeJSONStringify } from 'helpers/json';
import { createEditor } from 'tiptap/core';
import { AllExtensions } from 'tiptap/core/all-kit';
import { Collaboration } from 'tiptap/core/extensions/collaboration';
import { prosemirrorJSONToYDoc } from 'tiptap/core/thritypart/y-prosemirror/y-prosemirror';
import { markdownToProsemirror } from 'tiptap/markdown/markdown-to-prosemirror';
import * as Y from 'yjs';

export interface MarkdownParse {
  parse: (filename: string, markdown: string) => { title: string; content: string; state: Buffer };
  destroy: () => void;
}

export const createMarkdownParser = () => {
  const ydoc = new Y.Doc();
  const editor = createEditor({
    editable: false,
    extensions: AllExtensions.concat(Collaboration.configure({ document: ydoc })),
    content: '',
  });

  const parse = (filename: string, markdown: string) => {
    try {
      const prosemirrorNode = markdownToProsemirror({
        schema: editor.schema,
        content: markdown,
        needTitle: true,
        defaultTitle: filename.replace(/\.md$/gi, ''),
      });

      const title = prosemirrorNode.content[0].content[0].text;
      editor.commands.setContent(prosemirrorNode);
      Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(prosemirrorJSONToYDoc(editor.schema, prosemirrorNode)));
      const state = Y.encodeStateAsUpdate(ydoc);

      return {
        title,
        content: safeJSONStringify({ default: prosemirrorNode }),
        state: Buffer.from(state),
      };
    } catch (e) {
      console.error(e.message, e.stack);
      Toast.error('文件内容解析失败，请打开控制台，截图错误信息，请到 Github 提 issue 寻求解决！');
      throw e;
    }
  };

  const destroy = () => {
    ydoc.destroy();
    editor.destroy();
  };

  return { parse, destroy } as MarkdownParse;
};
