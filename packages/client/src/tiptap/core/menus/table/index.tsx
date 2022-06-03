import React from 'react';
import { Editor } from 'tiptap/core';

import { TableBubbleMenu } from './bubble';
import { TableColBubbleMenu } from './col-bubble';
import { TableRowBubbleMenu } from './row-bubble';

export const Table: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <TableBubbleMenu editor={editor} />
      <TableRowBubbleMenu editor={editor} />
      <TableColBubbleMenu editor={editor} />
    </>
  );
};
