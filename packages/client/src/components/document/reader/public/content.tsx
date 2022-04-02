import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { IDocument } from '@think/domains';
import { BaseKit, DocumentWithTitle } from 'tiptap';
import { safeJSONParse } from 'helpers/json';
import { CreateUser } from '../user';

interface IProps {
  document: IDocument;
  createUserContainerSelector: string;
}

export const DocumentContent: React.FC<IProps> = ({ document, createUserContainerSelector }) => {
  const c = safeJSONParse(document.content);
  let json = c.default || c;

  const editor = useEditor({
    editable: false,
    extensions: [...BaseKit, DocumentWithTitle],
    content: json,
  });

  if (!json) return null;

  return (
    <>
      <EditorContent editor={editor} />
      <CreateUser document={document} container={() => window.document.querySelector(createUserContainerSelector)} />
    </>
  );
};
