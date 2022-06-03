import { IconCopy, IconDelete } from '@douyinfe/semi-icons';
import { Button, Space } from '@douyinfe/semi-ui';
import { Divider } from 'components/divider';
import { Tooltip } from 'components/tooltip';
import React, { useCallback } from 'react';
import { BubbleMenu } from 'tiptap/core/bubble-menu';
import { DocumentChildren } from 'tiptap/core/extensions/document-children';
import { copyNode, deleteNode } from 'tiptap/prose-utils';

export const DocumentChildrenBubbleMenu = ({ editor }) => {
  const shouldShow = useCallback(() => editor.isActive(DocumentChildren.name), [editor]);
  const copyMe = useCallback(() => copyNode(DocumentChildren.name, editor), [editor]);
  const deleteMe = useCallback(() => deleteNode(DocumentChildren.name, editor), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="document-children-bubble-menu"
      shouldShow={shouldShow}
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
