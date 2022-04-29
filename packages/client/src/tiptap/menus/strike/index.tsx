import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { IconStrikeThrough } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { isTitleActive } from 'tiptap/prose-utils';

export const Strike: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Tooltip content="删除线">
      <Button
        theme={editor.isActive('strike') ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconStrikeThrough />}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={isTitleActive(editor)}
      />
    </Tooltip>
  );
};
