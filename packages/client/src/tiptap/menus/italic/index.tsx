import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { IconItalic } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { useActive } from 'tiptap/hooks/use-active';
import { Title } from 'tiptap/extensions/title';
import { Italic as ItalicExtension } from 'tiptap/extensions/italic';

export const Italic: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isItalicActive = useActive(editor, ItalicExtension.name);

  return (
    <Tooltip content="斜体">
      <Button
        theme={isItalicActive ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconItalic />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={isTitleActive}
      />
    </Tooltip>
  );
};
