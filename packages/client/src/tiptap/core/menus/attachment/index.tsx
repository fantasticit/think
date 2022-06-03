import React from 'react';
import { Editor } from 'tiptap/core';

import { AttachmentBubbleMenu } from './bubble';

export const Attachment: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <AttachmentBubbleMenu editor={editor} />
    </>
  );
};
