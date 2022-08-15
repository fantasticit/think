import React from 'react';
import { Editor } from 'tiptap/core';

import { ExcalidrawBubbleMenu } from './bubble';
import { ExcalidrawSettingModal } from './modal';

export const Excalidraw: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <ExcalidrawBubbleMenu editor={editor} />
      <ExcalidrawSettingModal editor={editor} />
    </>
  );
};
