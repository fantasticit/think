import React from 'react';
import { Editor } from 'tiptap/core';

import { FlowBubbleMenu } from './bubble';
import { FlowSettingModal } from './modal';

export const Flow: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <FlowBubbleMenu editor={editor} />
      <FlowSettingModal editor={editor} />
    </>
  );
};
