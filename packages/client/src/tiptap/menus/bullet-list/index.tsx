import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { IconList } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import { isTitleActive } from '../../services/is-active';

export const BulletList: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Tooltip content="无序列表">
      <Button
        theme={editor.isActive('bulletList') ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconList />}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={isTitleActive(editor)}
      />
    </Tooltip>
  );
};
