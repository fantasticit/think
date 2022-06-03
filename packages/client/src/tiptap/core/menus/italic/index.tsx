import { IconItalic } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import React, { useCallback } from 'react';
import { Editor } from 'tiptap/core';
import { Italic as ItalicExtension } from 'tiptap/core/extensions/italic';
import { Title } from 'tiptap/core/extensions/title';
import { useActive } from 'tiptap/core/hooks/use-active';

export const Italic: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isItalicActive = useActive(editor, ItalicExtension.name);

  const toggleItalic = useCallback(() => editor.chain().focus().toggleItalic().run(), [editor]);

  return (
    <Tooltip content="斜体">
      <Button
        theme={isItalicActive ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconItalic />}
        onClick={toggleItalic}
        disabled={isTitleActive}
      />
    </Tooltip>
  );
};
