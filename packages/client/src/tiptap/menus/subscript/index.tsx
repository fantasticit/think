import React from 'react';
import { Button } from '@douyinfe/semi-ui';
import { IconSub } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import { useActive } from 'tiptap/hooks/use-active';
import { Title } from 'tiptap/extensions/title';
import { Subscript as SubscriptExtension } from 'tiptap/extensions/subscript';

export const Subscript: React.FC<{ editor: any }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isSubscriptActive = useActive(editor, SubscriptExtension.name);

  return (
    <Tooltip content="下标">
      <Button
        theme={isSubscriptActive ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconSub />}
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        disabled={isTitleActive}
      />
    </Tooltip>
  );
};
