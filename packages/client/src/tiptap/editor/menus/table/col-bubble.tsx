import React, { useCallback } from 'react';
import { Space, Button } from '@douyinfe/semi-ui';
import { IconAddColumnBefore, IconAddColumnAfter, IconDeleteColumn } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import { BubbleMenu } from 'tiptap/editor/views/bubble-menu';
import { TableRow } from 'tiptap/core/extensions/table-row';
import { isTableSelected } from 'tiptap/prose-utils';

export const TableColBubbleMenu = ({ editor }) => {
  const addColumnBefore = useCallback(() => editor.chain().focus().addColumnBefore().run(), [editor]);
  const addColumnAfter = useCallback(() => editor.chain().focus().addColumnAfter().run(), [editor]);
  const deleteColumn = useCallback(() => editor.chain().focus().deleteColumn().run(), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu bubble-menu-table'}
      editor={editor}
      pluginKey="table-col-bubble-menu"
      tippyOptions={{
        offset: [0, 20],
      }}
      shouldShow={({ node, state }) => {
        if (!node || isTableSelected(state.selection)) return false;
        const gripColumn = node.querySelector('a.grip-column.selected');
        return editor.isActive(TableRow.name) && !!gripColumn;
      }}
      getRenderContainer={(node) => {
        return node;
      }}
    >
      <Space spacing={4}>
        <Tooltip content="向前插入一列">
          <Button
            onClick={addColumnBefore}
            icon={<IconAddColumnBefore />}
            type="tertiary"
            theme="borderless"
            size="small"
          />
        </Tooltip>

        <Tooltip content="向后插入一列">
          <Button
            onClick={addColumnAfter}
            icon={<IconAddColumnAfter />}
            type="tertiary"
            theme="borderless"
            size="small"
          />
        </Tooltip>
        <Tooltip content="删除当前列" hideOnClick>
          <Button onClick={deleteColumn} icon={<IconDeleteColumn />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
