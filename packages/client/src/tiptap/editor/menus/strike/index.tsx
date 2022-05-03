import React from 'react';
import { Editor } from 'tiptap/editor';
import { Button } from '@douyinfe/semi-ui';
import { IconStrikeThrough } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { useActive } from 'tiptap/editor/hooks/use-active';
import { Title } from 'tiptap/core/extensions/title';
import { Strike as StrikeExtension } from 'tiptap/core/extensions/strike';

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
