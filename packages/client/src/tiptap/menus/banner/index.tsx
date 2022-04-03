import React from 'react';
import { Editor } from '@tiptap/core';
import { BannerBubbleMenu } from './bubble';

export const Banner: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <BannerBubbleMenu editor={editor} />
    </>
  );
};
