import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { IconUnderline } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { isTitleActive } from 'tiptap/prose-utils';

export const Underline: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Tooltip content="下划线">
      <Button
        theme={editor.isActive('underline') ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconUnderline />}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={isTitleActive(editor)}
      />
    </Tooltip>
  );
};
