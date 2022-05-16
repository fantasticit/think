import { IconCode } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import React, { useCallback } from 'react';
import { Code as InlineCode } from 'tiptap/core/extensions/code';
import { Title } from 'tiptap/core/extensions/title';
import { Editor } from 'tiptap/editor';
import { useActive } from 'tiptap/editor/hooks/use-active';

export const Code: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isCodeActive = useActive(editor, InlineCode.name);

  const toggleCode = useCallback(() => editor.chain().focus().toggleCode().run(), [editor]);

  return (
    <Tooltip content="行内代码">
      <Button
        theme={isCodeActive ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconCode />}
        onClick={toggleCode}
        disabled={isTitleActive}
      />
    </Tooltip>
  );
};
