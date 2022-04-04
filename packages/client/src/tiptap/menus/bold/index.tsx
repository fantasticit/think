import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { IconBold } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { isTitleActive } from '../../utils/is-active';

export const Bold: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Tooltip content="粗体">
      <Button
        theme={editor.isActive('bold') ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconBold />}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={isTitleActive(editor)}
      />
    </Tooltip>
  );
};
