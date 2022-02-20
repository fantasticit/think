import { Space, Button, Tooltip } from "@douyinfe/semi-ui";
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
} from "components/icons";
import { Upload } from "components/upload";
import { BubbleMenu } from "../components/bubble-menu";
import { Divider } from "../components/divider";
import { Table, TableCell } from "../extensions/table";

export const TableBubbleMenu = ({ editor }) => {
  return (
    <BubbleMenu
      className={"bubble-menu"}
      editor={editor}
      pluginKey="table-bubble-menu"
      shouldShow={() => editor.isActive(Table.name)}
      tippyOptions={{
        maxWidth: 456,
      }}
      matchRenderContainer={(node: HTMLElement) =>
        node.classList && node.classList.contains("tableWrapper")
      }
    >
      <Space>
        <Tooltip content="向前插入一列" zIndex={10000}>
          <Button
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            icon={<IconAddColumnBefore />}
            type="tertiary"
            theme="borderless"
            size="small"
          />
        </Tooltip>

        <Tooltip content="向后插入一列" zIndex={10000}>
          <Button
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            icon={<IconAddColumnAfter />}
            type="tertiary"
            theme="borderless"
            size="small"
          />
        </Tooltip>
        <Tooltip content="删除当前列" zIndex={10000}>
          <Button
            onClick={() => editor.chain().focus().deleteColumn().run()}
            icon={<IconDeleteColumn />}
            type="tertiary"
            theme="borderless"
            size="small"
          />
        </Tooltip>

        <Tooltip content="向前插入一行" zIndex={10000}>
          <Button
            onClick={() => editor.chain().focus().addRowBefore().run()}
            icon={<IconAddRowBefore />}
            type="tertiary"
            theme="borderless"
            size="small"
          />
        </Tooltip>

        <Tooltip content="向后插入一行" zIndex={10000}>
          <Button
            onClick={() => editor.chain().focus().addRowAfter().run()}
            icon={<IconAddRowAfter />}
            type="tertiary"
            theme="borderless"
            size="small"
          />
        </Tooltip>

        <Tooltip content="删除当前行" zIndex={10000}>
          <Button
            onClick={() => editor.chain().focus().deleteRow().run()}
            icon={<IconDeleteRow />}
            type="tertiary"
            theme="borderless"
            size="small"
          />
        </Tooltip>

        <Tooltip content="合并单元格" zIndex={10000}>
          <Button
            size="small"
            type="tertiary"
            theme="borderless"
            icon={<IconMergeCell />}
            onClick={() => editor.chain().focus().mergeCells().run()}
          />
        </Tooltip>

        <Tooltip content="分离单元格" zIndex={10000}>
          <Button
            size="small"
            type="tertiary"
            theme="borderless"
            icon={<IconSplitCell />}
            onClick={() => editor.chain().focus().splitCell().run()}
          />
        </Tooltip>

        <Tooltip content="删除表格" zIndex={10000}>
          <Button
            size="small"
            type="tertiary"
            theme="borderless"
            icon={<IconDeleteTable />}
            onClick={() => editor.chain().focus().deleteTable().run()}
          />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
