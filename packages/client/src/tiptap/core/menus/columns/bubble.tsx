import { IconCopy, IconDelete } from '@douyinfe/semi-icons';
import { Button, Space } from '@douyinfe/semi-ui';
import { Divider } from 'components/divider';
import { Tooltip } from 'components/tooltip';
import { useCallback } from 'react';
import { BubbleMenu } from 'tiptap/core/bubble-menu';
import { Columns, IColumnsAttrs } from 'tiptap/core/extensions/columns';
import { useAttributes } from 'tiptap/core/hooks/use-attributes';
import { copyNode, deleteNode, getEditorContainerDOMSize } from 'tiptap/prose-utils';

export const ColumnsBubbleMenu = ({ editor }) => {
  const attrs = useAttributes<IColumnsAttrs>(editor, Columns.name, {
    type: 'left-right',
    columns: 2,
  });
  const { type, columns } = attrs;

  const getRenderContainer = useCallback((node) => {
    let container = node;
    if (!container.tag) {
      container = node.parentElement;
    }

    while (container && container.classList && !container.classList.contains('node-columns')) {
      container = container.parentElement;
    }

    return container;
  }, []);

  const shouldShow = useCallback(() => editor.isActive(Columns.name), [editor]);
  const copyMe = useCallback(() => copyNode(Columns.name, editor), [editor]);
  const deleteMe = useCallback(() => deleteNode(Columns.name, editor), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="columns-bubble-menu"
      shouldShow={shouldShow}
      getRenderContainer={getRenderContainer}
      tippyOptions={{ maxWidth: 'calc(100vw - 100px)' }}
    >
      <Space spacing={4}>
        <Tooltip content="复制">
          <Button onClick={copyMe} icon={<IconCopy />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Divider />

        <Tooltip content="删除节点" hideOnClick>
          <Button onClick={deleteMe} icon={<IconDelete />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
