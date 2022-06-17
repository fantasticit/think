import { Toast } from '@douyinfe/semi-ui';
import { safeJSONStringify } from 'helpers/json';
import { useEffect, useRef } from 'react';
import { useEditor } from 'tiptap/core';
import { AllExtensions } from 'tiptap/core/all-kit';
import { Collaboration } from 'tiptap/core/extensions/collaboration';
import { prosemirrorJSONToYDoc } from 'tiptap/core/thritypart/y-prosemirror/y-prosemirror';
import { markdownToProsemirror } from 'tiptap/markdown/markdown-to-prosemirror';
import * as Y from 'yjs';

let ydoc = null;

const getYdoc = () => {
  if (!ydoc) {
    ydoc = new Y.Doc();
  }
  return ydoc;
};

export const ImportEditor = ({ content, onChange }) => {
  const parsed = useRef(false);

  const editor = useEditor(
    {
      editable: false,
      extensions: AllExtensions.concat(Collaboration.configure({ document: getYdoc() })),
      content: '',
    },
    []
  );

  useEffect(() => {
    if (!content || !editor || !ydoc || parsed.current) return;

    try {
      const prosemirrorNode = markdownToProsemirror({ schema: editor.schema, content, needTitle: true });

      const title = prosemirrorNode.content[0].content[0].text;
      editor.commands.setContent(prosemirrorNode);
      Y.applyUpdate(getYdoc(), Y.encodeStateAsUpdate(prosemirrorJSONToYDoc(editor.schema, prosemirrorNode)));
      const state = Y.encodeStateAsUpdate(getYdoc());

      onChange({
        title,
        content: safeJSONStringify({ default: prosemirrorNode }),
        state: Buffer.from(state),
      });

      parsed.current = true;
    } catch (e) {
      Toast.error('文件内容解析失败，请到 Github 提 issue 寻求解决！');
    }

    return () => {
      editor.destroy();
    };
  }, [editor, content, onChange]);

  return null;
};
