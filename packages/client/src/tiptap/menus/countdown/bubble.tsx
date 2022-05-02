import { useCallback } from 'react';
import { Space, Button } from '@douyinfe/semi-ui';
import { IconEdit, IconCopy, IconDelete } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { BubbleMenu } from 'tiptap/views/bubble-menu';
import { Countdown } from 'tiptap/extensions/countdown';
import { Divider } from 'tiptap/divider';
import { copyNode, deleteNode } from 'tiptap/prose-utils';
import { useAttributes } from 'tiptap/hooks/use-attributes';
import { triggerOpenCountSettingModal } from '../_event';

export const CountdownBubbleMenu = ({ editor }) => {
  const attrs = useAttributes(editor, Countdown.name, {});

  const openEditLinkModal = useCallback(() => {
    triggerOpenCountSettingModal(attrs);
  }, [attrs]);

  const copyMe = useCallback(() => copyNode(Countdown.name, editor), [editor]);
  const deleteMe = useCallback(() => deleteNode(Countdown.name, editor), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="countdonw-bubble-menu"
      shouldShow={() => editor.isActive(Countdown.name)}
      tippyOptions={{ maxWidth: 'calc(100vw - 100px)' }}
    >
      <Space spacing={4}>
        <Tooltip content="复制">
          <Button onClick={copyMe} icon={<IconCopy />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Tooltip content="编辑">
          <Button size="small" type="tertiary" theme="borderless" icon={<IconEdit />} onClick={openEditLinkModal} />
        </Tooltip>

        <Divider />

        <Tooltip content="删除节点" hideOnClick>
          <Button onClick={deleteMe} icon={<IconDelete />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
