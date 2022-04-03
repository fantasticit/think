import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { IconItalic } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { isTitleActive } from '../../services/is-active';

export const Italic: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Tooltip content="斜体">
      <Button
        theme={editor.isActive('italic') ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconItalic />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={isTitleActive(editor)}
      />
    </Tooltip>
  );
};
