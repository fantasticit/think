import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { IconOrderedList } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import { isTitleActive } from '../../utils/is-active';

export const OrderedList: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Tooltip content="有序列表">
      <Button
        theme={editor.isActive('orderedList') ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconOrderedList />}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={isTitleActive(editor)}
      />
    </Tooltip>
  );
};
