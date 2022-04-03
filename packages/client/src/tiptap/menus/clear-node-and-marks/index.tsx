import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { IconClear } from 'components/icons';
import { Tooltip } from 'components/tooltip';

export const CleadrNodeAndMarks: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Tooltip content="清除格式">
      <Button
        onClick={() => {
          editor.chain().focus().unsetAllMarks().run();
          editor.chain().focus().clearNodes().run();
        }}
        icon={<IconClear />}
        type="tertiary"
        theme="borderless"
      />
    </Tooltip>
  );
};
