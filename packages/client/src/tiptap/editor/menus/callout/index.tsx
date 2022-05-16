import React from 'react';
import { Editor } from 'tiptap/editor';

import { CalloutBubbleMenu } from './bubble';

export const Callout: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <CalloutBubbleMenu editor={editor} />
    </>
  );
};
