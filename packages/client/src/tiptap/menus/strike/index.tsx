import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { IconStrikeThrough } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { useActive } from 'tiptap/hooks/use-active';
import { Title } from 'tiptap/extensions/title';
import { Strike as StrikeExtension } from 'tiptap/extensions/strike';

export const Strike: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isStrikeActive = useActive(editor, StrikeExtension.name);

  return (
    <Tooltip content="删除线">
      <Button
        theme={isStrikeActive ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconStrikeThrough />}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={isTitleActive}
      />
    </Tooltip>
  );
};
