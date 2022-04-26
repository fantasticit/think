import React from 'react';
import { Editor } from '@tiptap/core';
import { MindBubbleMenu } from './bubble';

export const Mind: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <MindBubbleMenu editor={editor} />
    </>
  );
};
