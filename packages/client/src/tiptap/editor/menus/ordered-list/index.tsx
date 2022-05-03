import React, { useCallback } from 'react';
import { Editor } from 'tiptap/editor';
import { Button } from '@douyinfe/semi-ui';
import { IconOrderedList } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import { useActive } from 'tiptap/editor/hooks/use-active';
import { Title } from 'tiptap/core/extensions/title';
import { OrderedList as OrderedListExtension } from 'tiptap/core/extensions/ordered-list';

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
