import React, { useCallback } from 'react';

import { Button } from '@douyinfe/semi-ui';

import { Editor } from 'tiptap/core';
import { Title } from 'tiptap/core/extensions/title';
import { useActive } from 'tiptap/core/hooks/use-active';

import { IconHorizontalRule } from 'components/icons';
import { Tooltip } from 'components/tooltip';

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
