import React, { useCallback } from 'react';
import { Space, Button } from '@douyinfe/semi-ui';
import { IconCopy } from '@douyinfe/semi-icons';
import {
  IconAddColumnBefore,
  IconAddColumnAfter,
  IconDeleteColumn,
  IconAddRowBefore,
  IconAddRowAfter,
  IconDeleteRow,
  IconMergeCell,
  IconSplitCell,
  IconDeleteTable,
  IconTableHeaderRow,
  IconTableHeaderColumn,
  IconTableHeaderCell,
} from 'components/icons';
import { Tooltip } from 'components/tooltip';
import { Divider } from 'tiptap/components/divider';
import { BubbleMenu } from 'tiptap/editor/views/bubble-menu';
import { Table } from 'tiptap/core/extensions/table';
import { copyNode } from 'tiptap/prose-utils';

export const TableBubbleMenu = ({ editor }) => {
  const copyMe = useCallback(() => copyNode(Table.name, editor), [editor]);
  const deleteMe = useCallback(() => editor.chain().focus().deleteTable(), [editor]);
  const addColumnBefore = useCallback(() => editor.chain().focus().addColumnBefore().run(), [editor]);
  const addColumnAfter = useCallback(() => editor.chain().focus().addColumnAfter().run(), [editor]);
  const deleteColumn = useCallback(() => editor.chain().focus().deleteColumn().run(), [editor]);
  const addRowBefore = useCallback(() => editor.chain().focus().addRowBefore().run(), [editor]);
  const addRowAfter = useCallback(() => editor.chain().focus().addRowAfter().run(), [editor]);
  const deleteRow = useCallback(() => editor.chain().focus().deleteRow().run(), [editor]);
  const toggleHeaderColumn = useCallback(() => editor.chain().focus().toggleHeaderColumn().run(), [editor]);
  const toggleHeaderRow = useCallback(() => editor.chain().focus().toggleHeaderRow().run(), [editor]);
  const toggleHeaderCell = useCallback(() => editor.chain().focus().toggleHeaderCell().run(), [editor]);
  const mergeCells = useCallback(() => editor.chain().focus().mergeCells().run(), [editor]);
  const splitCell = useCallback(() => editor.chain().focus().splitCell().run(), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu bubble-menu-table'}
      editor={editor}
      pluginKey="table-bubble-menu"
      shouldShow={() => editor.isActive(Table.name)}
      tippyOptions={{
        maxWidth: 'calc(100vw - 100px)',
      }}
      matchRenderContainer={(node: HTMLElement) => node && node.tagName === 'TABLE'}
    >
      <Space spacing={4}>
        <Tooltip content="复制">
          <Button onClick={copyMe} icon={<IconCopy />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Divider />

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

        <Divider />

        <Tooltip content="向前插入一行">
          <Button onClick={addRowBefore} icon={<IconAddRowBefore />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Tooltip content="向后插入一行">
          <Button onClick={addRowAfter} icon={<IconAddRowAfter />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Tooltip content="删除当前行" hideOnClick>
          <Button onClick={deleteRow} icon={<IconDeleteRow />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Divider />

        <Tooltip content="设置(或取消)当前列为表头">
          <Button
            size="small"
            type="tertiary"
            theme="borderless"
            icon={<IconTableHeaderColumn />}
            onClick={toggleHeaderColumn}
          />
        </Tooltip>

        <Tooltip content="设置(或取消)当前行为表头">
          <Button
            size="small"
            type="tertiary"
            theme="borderless"
            icon={<IconTableHeaderRow />}
            onClick={toggleHeaderRow}
          />
        </Tooltip>

        <Tooltip content="设置(或取消)当前单元格为表头">
          <Button
            size="small"
            type="tertiary"
            theme="borderless"
            icon={<IconTableHeaderCell />}
            onClick={toggleHeaderCell}
          />
        </Tooltip>

        <Divider />

        <Tooltip content="合并单元格">
          <Button size="small" type="tertiary" theme="borderless" icon={<IconMergeCell />} onClick={mergeCells} />
        </Tooltip>

        <Tooltip content="分离单元格">
          <Button size="small" type="tertiary" theme="borderless" icon={<IconSplitCell />} onClick={splitCell} />
        </Tooltip>

        <Divider />

        <Tooltip content="删除表格" hideOnClick>
          <Button size="small" type="tertiary" theme="borderless" icon={<IconDeleteTable />} onClick={deleteMe} />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
