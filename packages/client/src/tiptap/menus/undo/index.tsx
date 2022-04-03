import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { IconUndo } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';

export const Undo: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Tooltip content="撤销">
      <Button
        onClick={() => editor.chain().focus().undo().run()}
        icon={<IconUndo />}
        type="tertiary"
        theme="borderless"
      />
    </Tooltip>
  );
};
