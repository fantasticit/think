import React from 'react';
import { Editor } from 'tiptap/editor';
import { TableBubbleMenu } from './bubble';
import { TableRowBubbleMenu } from './row-bubble';
import { TableColBubbleMenu } from './col-bubble';

export const Table: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <TableBubbleMenu editor={editor} />
      <TableRowBubbleMenu editor={editor} />
      <TableColBubbleMenu editor={editor} />
    </>
  );
};
