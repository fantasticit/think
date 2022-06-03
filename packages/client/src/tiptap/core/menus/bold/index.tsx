import { IconBold } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import React, { useCallback } from 'react';
import { Editor } from 'tiptap/core';
import { Bold as BoldExtension } from 'tiptap/core/extensions/bold';
import { Title } from 'tiptap/core/extensions/title';
import { useActive } from 'tiptap/core/hooks/use-active';

export const Bold: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isBoldActive = useActive(editor, BoldExtension.name);

  const toggleBold = useCallback(() => editor.chain().focus().toggleBold().run(), [editor]);

  return (
    <Tooltip content="粗体">
      <Button
        theme={isBoldActive ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconBold />}
        onClick={toggleBold}
        disabled={isTitleActive}
      />
    </Tooltip>
  );
};
