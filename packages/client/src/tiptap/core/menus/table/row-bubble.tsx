import { Button, Space } from '@douyinfe/semi-ui';
import { IconAddRowAfter, IconAddRowBefore, IconDeleteRow } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import React, { useCallback } from 'react';
import { BubbleMenu } from 'tiptap/core/bubble-menu';
import { Table } from 'tiptap/core/extensions/table';
import { isTableSelected } from 'tiptap/prose-utils';

export const TableRowBubbleMenu = ({ editor }) => {
  const shouldShow = useCallback(
    ({ node, state }) => {
      if (!editor.isActive(Table.name) || !node || isTableSelected(state.selection)) return false;

      let container = node;

      while (container && !['TD', 'TH'].includes(container.tagName)) {
        container = container.parentElement;
      }

      const gripRow = container && container.querySelector && container.querySelector('a.grip-row.selected');
      return !!gripRow;
    },
    [editor]
  );
  const getRenderContainer = useCallback((node) => {
    return node;
  }, []);
  const addRowBefore = useCallback(() => editor.chain().focus().addRowBefore().run(), [editor]);
  const addRowAfter = useCallback(() => editor.chain().focus().addRowAfter().run(), [editor]);
  const deleteRow = useCallback(() => editor.chain().focus().deleteRow().run(), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu bubble-menu-table'}
      editor={editor}
      pluginKey="table-row-bubble-menu"
      tippyOptions={{
        placement: 'left',
        offset: [0, 30],
      }}
      shouldShow={shouldShow}
      getRenderContainer={getRenderContainer}
    >
      <Space vertical spacing={4}>
        <Tooltip content="向前插入一行" position="left">
          <Button onClick={addRowBefore} icon={<IconAddRowBefore />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Tooltip content="向后插入一行" position="left">
          <Button onClick={addRowAfter} icon={<IconAddRowAfter />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Tooltip content="删除当前行" position="left" hideOnClick>
          <Button onClick={deleteRow} icon={<IconDeleteRow />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
