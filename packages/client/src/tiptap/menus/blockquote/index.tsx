import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import { IconQuote } from 'components/icons';
import { isTitleActive } from '../../services/is-active';

export const Blockquote: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Tooltip content="插入引用">
      <Button
        theme={editor.isActive('blockquote') ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconQuote />}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
        disabled={isTitleActive(editor)}
      />
    </Tooltip>
  );
};
