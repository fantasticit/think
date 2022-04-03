import React from 'react';
import { Editor } from '@tiptap/core';
import { ImageBubbleMenu } from './bubble';

export const Image: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <ImageBubbleMenu editor={editor} />
    </>
  );
};
