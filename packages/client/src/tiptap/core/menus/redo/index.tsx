import React, { useCallback } from 'react';

import { IconRedo } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';

import { Editor } from 'tiptap/core';

import { Tooltip } from 'components/tooltip';

export const Redo: React.FC<{ editor: Editor }> = ({ editor }) => {
  const redo = useCallback(() => editor.chain().focus().redo().run(), [editor]);

  return (
    <Tooltip content="重做">
      <Button onClick={redo} icon={<IconRedo />} type="tertiary" theme="borderless" />
    </Tooltip>
  );
};
