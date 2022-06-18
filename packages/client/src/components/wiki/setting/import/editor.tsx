import { Toast } from '@douyinfe/semi-ui';
import { safeJSONStringify } from 'helpers/json';
import { useEffect, useMemo, useRef } from 'react';
import { useEditor } from 'tiptap/core';
import { AllExtensions } from 'tiptap/core/all-kit';
import { Collaboration } from 'tiptap/core/extensions/collaboration';
import { prosemirrorJSONToYDoc } from 'tiptap/core/thritypart/y-prosemirror/y-prosemirror';
import { markdownToProsemirror } from 'tiptap/markdown/markdown-to-prosemirror';
import * as Y from 'yjs';

export const ImportEditor = ({ filename, content, onChange, onError }) => {
  const parsed = useRef(false);
  const ydoc = useMemo(() => new Y.Doc(), []);
  const editor = useEditor(
    {
      editable: false,
      extensions: AllExtensions.concat(Collaboration.configure({ document: ydoc })),
      content: '',
    },
    [ydoc]
  );

  useEffect(() => {
    if (!content || !editor || !ydoc || parsed.current) return;

    try {
      const prosemirrorNode = markdownToProsemirror({
        schema: editor.schema,
        content,
        needTitle: true,
        defaultTitle: filename.replace(/\.md$/gi, ''),
      });

      const title = prosemirrorNode.content[0].content[0].text;
      editor.commands.setContent(prosemirrorNode);
      Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(prosemirrorJSONToYDoc(editor.schema, prosemirrorNode)));
      const state = Y.encodeStateAsUpdate(ydoc);

      onChange({
        title,
        content: safeJSONStringify({ default: prosemirrorNode }),
        state: Buffer.from(state),
      });

      parsed.current = true;
    } catch (e) {
      onError();
      console.error(e.message, e.stack);
      Toast.error('文件内容解析失败，请打开控制台，截图错误信息，请到 Github 提 issue 寻求解决！');
    }

    return () => {
      ydoc.destroy();
      editor.destroy();
    };
  }, [editor, ydoc, filename, content, onChange, onError]);

  return null;
};
