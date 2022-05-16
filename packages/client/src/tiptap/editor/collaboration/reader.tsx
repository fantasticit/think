import { safeJSONParse } from 'helpers/json';
import React, { useMemo } from 'react';

import { EditorContent, useEditor } from '../react';
import { CollaborationKit } from './kit';

interface IProps {
  content: string;
}

export const ReaderEditor: React.FC<IProps> = ({ content }) => {
  const json = useMemo(() => {
    const c = safeJSONParse(content);
    const json = c.default || c;
    return json;
  }, [content]);

  const editor = useEditor(
    {
      editable: false,
      extensions: CollaborationKit,
      content: json,
    },
    [json]
  );

  return <EditorContent editor={editor} />;
};
