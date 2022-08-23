import { IconRedo } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import React, { useCallback } from 'react';
import { Editor } from 'tiptap/core';

export const Redo: React.FC<{ editor: Editor }> = ({ editor }) => {
  const redo = useCallback(() => editor.chain().focus().redo().run(), [editor]);

  return (
    <Tooltip content="重做">
      <Button onClick={redo} icon={<IconRedo />} type="tertiary" theme="borderless" />
    </Tooltip>
  );
};
