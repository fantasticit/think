import React from 'react';
import { Editor } from 'tiptap/core';

import { ColumnsBubbleMenu } from './bubble';

export const Columns: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <ColumnsBubbleMenu editor={editor} />
    </>
  );
};
