import { Button, Space } from '@douyinfe/semi-ui';
import { IconAddColumnAfter, IconAddColumnBefore, IconDeleteColumn } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import React, { useCallback } from 'react';
import { BubbleMenu } from 'tiptap/core/bubble-menu';
import { Table } from 'tiptap/core/extensions/table';
import { isTableSelected } from 'tiptap/prose-utils';

export const TableColBubbleMenu = ({ editor }) => {
  const shouldShow = useCallback(
    ({ node, state }) => {
      if (!editor.isActive(Table.name) || !node || isTableSelected(state.selection)) return false;

      let container = node;

      while (container && !['TD', 'TH'].includes(container.tagName)) {
        container = container.parentElement;
      }

      const gripColumn = container && container.querySelector && container.querySelector('a.grip-column.selected');
      return !!gripColumn;
    },
    [editor]
  );
  const getRenderContainer = useCallback((node) => {
    return node;
  }, []);
  const addColumnBefore = useCallback(() => editor.chain().focus().addColumnBefore().run(), [editor]);
  const addColumnAfter = useCallback(() => editor.chain().focus().addColumnAfter().run(), [editor]);
  const deleteColumn = useCallback(() => editor.chain().focus().deleteColumn().run(), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu bubble-menu-table'}
      editor={editor}
      pluginKey="table-col-bubble-menu"
      tippyOptions={{
        offset: [0, 35],
      }}
      shouldShow={shouldShow}
      getRenderContainer={getRenderContainer}
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
