import React, { useCallback } from 'react';
import { Space, Button } from '@douyinfe/semi-ui';
import { IconAddRowBefore, IconAddRowAfter, IconDeleteRow } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import { BubbleMenu } from 'tiptap/editor/views/bubble-menu';
import { Table } from 'tiptap/core/extensions/table';
import { isTableSelected } from 'tiptap/prose-utils';

export const TableRowBubbleMenu = ({ editor }) => {
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
        offset: [0, 20],
      }}
      shouldShow={({ node, state }) => {
        if (!editor.isActive(Table.name) || !node || isTableSelected(state.selection)) return false;
        const gripRow = node.querySelector('a.grip-row.selected');
        return !!gripRow;
      }}
      getRenderContainer={(node) => {
        return node;
      }}
    >
      <Space vertical spacing={4}>
        <Tooltip content="向前插入一行">
          <Button onClick={addRowBefore} icon={<IconAddRowBefore />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Tooltip content="向后插入一行">
          <Button onClick={addRowAfter} icon={<IconAddRowAfter />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Tooltip content="删除当前行" hideOnClick>
          <Button onClick={deleteRow} icon={<IconDeleteRow />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
