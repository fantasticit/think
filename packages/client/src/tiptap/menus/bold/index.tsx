import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { IconBold } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { useActive } from 'tiptap/hooks/use-active';
import { Title } from 'tiptap/extensions/title';
import { Bold as BoldExtension } from 'tiptap/extensions/bold';

export const Bold: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isBoldActive = useActive(editor, BoldExtension.name);

  return (
    <Tooltip content="粗体">
      <Button
        theme={isBoldActive ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconBold />}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={isTitleActive}
      />
    </Tooltip>
  );
};
