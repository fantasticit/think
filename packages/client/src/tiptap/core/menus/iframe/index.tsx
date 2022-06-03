import React from 'react';
import { Editor } from 'tiptap/core';

import { IframeBubbleMenu } from './bubble';

export const Iframe: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <IframeBubbleMenu editor={editor} />
    </>
  );
};
