import React from 'react';
import { Editor } from 'tiptap/core';

import { DocumentReferenceBubbleMenu } from './bubble';

export const DocumentReference: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <DocumentReferenceBubbleMenu editor={editor} />
    </>
  );
};
