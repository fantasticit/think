import React from 'react';
import { Editor } from 'tiptap/editor';
import { AttachmentBubbleMenu } from './bubble';

export const Attachment: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <AttachmentBubbleMenu editor={editor} />
    </>
  );
};
