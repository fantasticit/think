import { IconUnderline } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import React, { useCallback } from 'react';
import { Editor } from 'tiptap/core';
import { Title } from 'tiptap/core/extensions/title';
import { Underline as UnderlineExtension } from 'tiptap/core/extensions/underline';
import { useActive } from 'tiptap/core/hooks/use-active';

export const Underline: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isUnderlineActive = useActive(editor, UnderlineExtension.name);

  const toggleUnderline = useCallback(() => editor.chain().focus().toggleUnderline().run(), [editor]);

  return (
    <Tooltip content="下划线">
      <Button
        theme={isUnderlineActive ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconUnderline />}
        onClick={toggleUnderline}
        disabled={isTitleActive}
      />
    </Tooltip>
  );
};
