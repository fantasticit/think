import React from 'react';
import { Editor } from '@tiptap/core';
import { TableBubbleMenu } from './bubble';

export const Table: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return <TableBubbleMenu editor={editor} />;
};
