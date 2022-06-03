import { IconUndo } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import React, { useCallback } from 'react';
import { Editor } from 'tiptap/core';

export const Undo: React.FC<{ editor: Editor }> = ({ editor }) => {
  const undo = useCallback(() => editor.chain().focus().undo().run(), [editor]);

  return (
    <Tooltip content="撤销">
      <Button onClick={undo} icon={<IconUndo />} type="tertiary" theme="borderless" />
    </Tooltip>
  );
};
