import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { IconCode } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { useActive } from 'tiptap/hooks/use-active';
import { Title } from 'tiptap/extensions/title';
import { Code as InlineCode } from 'tiptap/extensions/code';

export const Code: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isCodeActive = useActive(editor, InlineCode.name);

  return (
    <Tooltip content="行内代码">
      <Button
        theme={isCodeActive ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconCode />}
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={isTitleActive}
      />
    </Tooltip>
  );
};
