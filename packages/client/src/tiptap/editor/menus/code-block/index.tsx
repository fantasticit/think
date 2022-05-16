import React from 'react';
import { Editor } from 'tiptap/editor';

import { CodeBlockBubbleMenu } from './bubble';

export const CodeBlock: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <CodeBlockBubbleMenu editor={editor} />
    </>
  );
};
