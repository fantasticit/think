import React, { useCallback } from 'react';

import { Button } from '@douyinfe/semi-ui';

import { Subscript as SubscriptExtension } from 'tiptap/core/extensions/subscript';
import { Title } from 'tiptap/core/extensions/title';
import { useActive } from 'tiptap/core/hooks/use-active';

import { IconSub } from 'components/icons';
import { Tooltip } from 'components/tooltip';

export const Subscript: React.FC<{ editor: any }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isSubscriptActive = useActive(editor, SubscriptExtension.name);

  const toggleSubscript = useCallback(() => editor.chain().focus().toggleSubscript().run(), [editor]);

  return (
    <Tooltip content="下标">
      <Button
        theme={isSubscriptActive ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconSub />}
        onClick={toggleSubscript}
        disabled={isTitleActive}
      />
    </Tooltip>
  );
};
