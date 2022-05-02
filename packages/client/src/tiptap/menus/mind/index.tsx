import React from 'react';
import { Editor } from '@tiptap/core';
import { MindBubbleMenu } from './bubble';

export const Mind: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <MindBubbleMenu editor={editor} />
    </>
  );
};
