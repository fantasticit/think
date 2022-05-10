import React, { useCallback } from 'react';
import { Button } from '@douyinfe/semi-ui';
import { IconSup } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import { useActive } from 'tiptap/editor/hooks/use-active';
import { Title } from 'tiptap/core/extensions/title';
import { Superscript as SuperscriptExtension } from 'tiptap/core/extensions/superscript';

export const Superscript: React.FC<{ editor: any }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isSuperscriptActive = useActive(editor, SuperscriptExtension.name);

  const toggleSuperscript = useCallback(() => editor.chain().focus().toggleSuperscript().run(), [editor]);

  return (
    <Tooltip content="上标">
      <Button
        theme={isSuperscriptActive ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconSup />}
        onClick={toggleSuperscript}
        disabled={isTitleActive}
      />
    </Tooltip>
  );
};
