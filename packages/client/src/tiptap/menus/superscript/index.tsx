import React from 'react';
import { Button } from '@douyinfe/semi-ui';
import { IconSup } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import { isTitleActive } from '../../services/is-active';

export const Superscript: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Tooltip content="上标">
      <Button
        theme={editor.isActive('superscript') ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconSup />}
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        disabled={isTitleActive(editor)}
      />
    </Tooltip>
  );
};
