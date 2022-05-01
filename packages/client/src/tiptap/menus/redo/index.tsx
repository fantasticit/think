import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { IconRedo } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';

export const Redo: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <Tooltip content="撤销">
      <Button
        onClick={() => editor.chain().focus().redo().run()}
        icon={<IconRedo />}
        type="tertiary"
        theme="borderless"
      />
    </Tooltip>
  );
};
