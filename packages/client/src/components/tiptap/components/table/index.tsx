import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Space, Popover, Tag, Input } from '@douyinfe/semi-ui';

export const TableWrapper = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { color, text } = node.attrs;
  const content = <Tag color={color}>{text || '点击设置状态'}</Tag>;

  console.log(node.attrs);

  return (
    <NodeViewWrapper as="div">
      <table>
        <NodeViewContent></NodeViewContent>
      </table>
    </NodeViewWrapper>
  );
};
