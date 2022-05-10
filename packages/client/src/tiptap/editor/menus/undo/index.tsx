import React, { useCallback } from 'react';
import { Editor } from 'tiptap/editor';
import { Button } from '@douyinfe/semi-ui';
import { IconUndo } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';

export const Undo: React.FC<{ editor: Editor }> = ({ editor }) => {
  const undo = useCallback(() => editor.chain().focus().undo().run(), [editor]);

  return (
    <Tooltip content="撤销">
      <Button onClick={undo} icon={<IconUndo />} type="tertiary" theme="borderless" />
    </Tooltip>
  );
};
