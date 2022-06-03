import { Button } from '@douyinfe/semi-ui';
import { IconClear } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import React, { useCallback } from 'react';
import { Editor } from 'tiptap/core';

export const CleadrNodeAndMarks: React.FC<{ editor: Editor }> = ({ editor }) => {
  const clear = useCallback(() => {
    editor.chain().focus().unsetAllMarks().run();
    editor.chain().focus().clearNodes().run();
  }, [editor]);

  return (
    <Tooltip content="清除格式">
      <Button onClick={clear} icon={<IconClear />} type="tertiary" theme="borderless" />
    </Tooltip>
  );
};
