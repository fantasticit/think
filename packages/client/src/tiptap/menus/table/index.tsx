import React from 'react';
import { Editor } from '@tiptap/core';
import { TableBubbleMenu } from './bubble';

export const Table: React.FC<{ editor: Editor }> = ({ editor }) => {
  return <TableBubbleMenu editor={editor} />;
};
