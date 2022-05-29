import React from 'react';
import { Editor } from 'tiptap/editor';

import { KatexBubbleMenu } from './bubble';

export const Katex: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <KatexBubbleMenu editor={editor} />
    </>
  );
};
