import React, { useMemo } from 'react';
import { IDocument } from '@think/domains';
import { useEditor, EditorContent, BaseKit, DocumentWithTitle } from 'tiptap';
import { safeJSONParse } from 'helpers/json';
import { CreateUser } from '../user';

interface IProps {
  document: IDocument;
  createUserContainerSelector: string;
}

export const DocumentContent: React.FC<IProps> = ({ document, createUserContainerSelector }) => {
  const json = useMemo(() => {
    const c = safeJSONParse(document.content);
    const json = c.default || c;
    return json;
  }, [document]);

  const editor = useEditor(
    {
      editable: false,
      extensions: [...BaseKit, DocumentWithTitle],
      content: json,
    },
    [json]
  );

  return (
    <>
      <EditorContent editor={editor} />
      <CreateUser document={document} container={() => window.document.querySelector(createUserContainerSelector)} />
    </>
  );
};
