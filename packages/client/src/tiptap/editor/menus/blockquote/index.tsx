import React, { useCallback } from 'react';
import { Editor } from 'tiptap/editor';
import { Button } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import { IconQuote } from 'components/icons';
import { useActive } from 'tiptap/editor/hooks/use-active';
import { Title } from 'tiptap/core/extensions/title';
import { Blockquote as BlockquoteExtension } from 'tiptap/core/extensions/blockquote';

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
