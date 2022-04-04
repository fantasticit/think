import React from 'react';
import { Button } from '@douyinfe/semi-ui';
import { IconSub } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import { isTitleActive } from '../../utils/is-active';

export const Subscript: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Tooltip content="下标">
      <Button
        theme={editor.isActive('subscript') ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconSub />}
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        disabled={isTitleActive(editor)}
      />
    </Tooltip>
  );
};
