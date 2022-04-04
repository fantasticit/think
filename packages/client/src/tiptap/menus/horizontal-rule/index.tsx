import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import { IconHorizontalRule } from 'components/icons';
import { isTitleActive } from '../../utils/is-active';

export const HorizontalRule: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Tooltip content="插入分割线">
      <Button
        theme={'borderless'}
        type="tertiary"
        icon={<IconHorizontalRule />}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        disabled={isTitleActive(editor)}
      />
    </Tooltip>
  );
};
