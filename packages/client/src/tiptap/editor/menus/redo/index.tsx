import React, { useCallback } from 'react';
import { Editor } from 'tiptap/editor';
import { Button } from '@douyinfe/semi-ui';
import { IconRedo } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';

export const Redo: React.FC<{ editor: Editor }> = ({ editor }) => {
  const redo = useCallback(() => editor.chain().focus().redo().run(), [editor]);

  return (
    <Tooltip content="撤销">
      <Button onClick={redo} icon={<IconRedo />} type="tertiary" theme="borderless" />
    </Tooltip>
  );
};
