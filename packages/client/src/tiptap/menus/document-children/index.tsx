import React from 'react';
import { Editor } from '@tiptap/core';
import { DocumentChildrenBubbleMenu } from './bubble';

export const DocumentChildren: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <DocumentChildrenBubbleMenu editor={editor} />
    </>
  );
};
