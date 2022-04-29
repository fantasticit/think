import React from 'react';
import { Editor } from '@tiptap/core';
import { CodeBlockBubbleMenu } from './bubble';

export const CodeBlock: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <CodeBlockBubbleMenu editor={editor} />
    </>
  );
};
