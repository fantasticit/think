import { IconStrikeThrough } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import React, { useCallback } from 'react';
import { Strike as StrikeExtension } from 'tiptap/core/extensions/strike';
import { Title } from 'tiptap/core/extensions/title';
import { Editor } from 'tiptap/editor';
import { useActive } from 'tiptap/editor/hooks/use-active';

export const Strike: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isStrikeActive = useActive(editor, StrikeExtension.name);

  const toggleStrike = useCallback(() => editor.chain().focus().toggleStrike().run(), [editor]);

  return (
    <Tooltip content="删除线">
      <Button
        theme={isStrikeActive ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconStrikeThrough />}
        onClick={toggleStrike}
        disabled={isTitleActive}
      />
    </Tooltip>
  );
};
