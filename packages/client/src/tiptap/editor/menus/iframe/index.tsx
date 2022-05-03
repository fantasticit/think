import React from 'react';
import { Editor } from 'tiptap/editor';
import { IframeBubbleMenu } from './bubble';

export const Iframe: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <IframeBubbleMenu editor={editor} />
    </>
  );
};
