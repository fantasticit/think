import { Space, Button } from '@douyinfe/semi-ui';
import { IconCopy, IconDelete } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { BubbleMenu } from 'tiptap/editor/views/bubble-menu';
import { Attachment } from 'tiptap/core/extensions/attachment';
import { copyNode, deleteNode } from 'tiptap/prose-utils';
import { Divider } from 'tiptap/components/divider';
import { useCallback } from 'react';

export const AttachmentBubbleMenu = ({ editor }) => {
  const copyMe = useCallback(() => copyNode(Attachment.name, editor), [editor]);
  const deleteMe = useCallback(() => deleteNode(Attachment.name, editor), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="attachment-bubble-menu"
      shouldShow={() => editor.isActive(Attachment.name)}
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
