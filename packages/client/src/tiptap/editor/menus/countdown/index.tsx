import React from 'react';
import { Editor } from 'tiptap/editor';

import { CountdownBubbleMenu } from './bubble';
import { CountdownSettingModal } from './modal';

export const Countdonw: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <CountdownBubbleMenu editor={editor} />
      <CountdownSettingModal editor={editor} />
    </>
  );
};
