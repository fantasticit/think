import React, { useCallback } from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import { IconHorizontalRule } from 'components/icons';
import { useActive } from 'tiptap/hooks/use-active';
import { Title } from 'tiptap/extensions/title';

export const HorizontalRule: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);

  const setHorizontalRule = useCallback(() => editor.chain().focus().setHorizontalRule().run(), [editor]);

  return (
    <Tooltip content="插入分割线">
      <Button
        theme={'borderless'}
        type="tertiary"
        icon={<IconHorizontalRule />}
        onClick={setHorizontalRule}
        disabled={isTitleActive}
      />
    </Tooltip>
  );
};
