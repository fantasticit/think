import React from 'react';
import { Editor } from '@tiptap/core';
import { CalloutBubbleMenu } from './bubble';

export const Callout: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <CalloutBubbleMenu editor={editor} />
    </>
  );
};
