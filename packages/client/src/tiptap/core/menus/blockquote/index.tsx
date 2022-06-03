import { Button } from '@douyinfe/semi-ui';
import { IconQuote } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import React, { useCallback } from 'react';
import { Editor } from 'tiptap/core';
import { Blockquote as BlockquoteExtension } from 'tiptap/core/extensions/blockquote';
import { Title } from 'tiptap/core/extensions/title';
import { useActive } from 'tiptap/core/hooks/use-active';

export const Blockquote: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isBlockquoteActive = useActive(editor, BlockquoteExtension.name);

  const toggleBlockquote = useCallback(() => editor.chain().focus().toggleBlockquote().run(), [editor]);

  return (
    <Tooltip content="插入引用">
      <Button
        theme={isBlockquoteActive ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconQuote />}
        onClick={toggleBlockquote}
        disabled={isTitleActive}
      />
    </Tooltip>
  );
};
