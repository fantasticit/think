import { useCallback } from 'react';

import { IconCopy, IconDelete } from '@douyinfe/semi-icons';
import { Button, Space } from '@douyinfe/semi-ui';

import { BubbleMenu } from 'tiptap/core/bubble-menu';
import { Columns } from 'tiptap/core/extensions/columns';
import { copyNode, deleteNode } from 'tiptap/prose-utils';

import { Divider } from 'components/divider';
import { IconAddColAfter, IconAddColBefore, IconDeleteCol } from 'components/icons';
import { Tooltip } from 'components/tooltip';

export const ColumnsBubbleMenu = ({ editor }) => {
  const getRenderContainer = useCallback((node) => {
    let container = node;
    if (!container.tag) {
      container = node.parentElement;
    }

    while (container && container.classList && !container.classList.contains('columns')) {
      container = container.parentElement;
    }

    return container;
  }, []);

  const shouldShow = useCallback(() => editor.isActive(Columns.name), [editor]);
  const copyMe = useCallback(() => copyNode(Columns.name, editor), [editor]);
  const deleteMe = useCallback(() => deleteNode(Columns.name, editor), [editor]);
  const addColBefore = useCallback(() => editor.chain().focus().addColBefore().run(), [editor]);
  const addColAfter = useCallback(() => editor.chain().focus().addColAfter().run(), [editor]);
  const deleteCol = useCallback(() => editor.chain().focus().deleteCol().run(), [editor]);

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
          <Button onClick={copyMe} icon={<IconCopy />} size="small" type="tertiary" theme="borderless" />
        </Tooltip>

        <Divider />

        <Tooltip content="向前插入一列">
          <Button onClick={addColBefore} icon={<IconAddColBefore />} size="small" type="tertiary" theme="borderless" />
        </Tooltip>

        <Tooltip content="向后插入一列">
          <Button onClick={addColAfter} icon={<IconAddColAfter />} size="small" type="tertiary" theme="borderless" />
        </Tooltip>

        <Tooltip content="删除当前列">
          <Button onClick={deleteCol} icon={<IconDeleteCol />} size="small" type="tertiary" theme="borderless" />
        </Tooltip>

        <Divider />

        <Tooltip content="删除">
          <Button size="small" type="tertiary" theme="borderless" icon={<IconDelete />} onClick={deleteMe} />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
