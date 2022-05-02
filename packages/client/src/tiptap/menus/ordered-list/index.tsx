import React, { useCallback } from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { IconOrderedList } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import { useActive } from 'tiptap/hooks/use-active';
import { Title } from 'tiptap/extensions/title';
import { OrderedList as OrderedListExtension } from 'tiptap/extensions/ordered-list';

export const OrderedList: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isOrderedListActive = useActive(editor, OrderedListExtension.name);

  const toggleOrderedList = useCallback(() => editor.chain().focus().toggleOrderedList().run(), [editor]);

  return (
    <Tooltip content="有序列表">
      <Button
        theme={isOrderedListActive ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconOrderedList />}
        onClick={toggleOrderedList}
        disabled={isTitleActive}
      />
    </Tooltip>
  );
};
