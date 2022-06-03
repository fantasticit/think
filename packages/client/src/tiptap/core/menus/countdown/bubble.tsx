import { IconCopy, IconDelete, IconEdit } from '@douyinfe/semi-icons';
import { Button, Space } from '@douyinfe/semi-ui';
import { Divider } from 'components/divider';
import { Tooltip } from 'components/tooltip';
import { useCallback } from 'react';
import { BubbleMenu } from 'tiptap/core/bubble-menu';
import { Countdown } from 'tiptap/core/extensions/countdown';
import { useAttributes } from 'tiptap/core/hooks/use-attributes';
import { copyNode, deleteNode } from 'tiptap/prose-utils';

import { triggerOpenCountSettingModal } from '../_event';

export const CountdownBubbleMenu = ({ editor }) => {
  const attrs = useAttributes(editor, Countdown.name, {});

  const openEditLinkModal = useCallback(() => {
    triggerOpenCountSettingModal(editor, attrs);
  }, [editor, attrs]);
  const shouldShow = useCallback(() => editor.isActive(Countdown.name), [editor]);
  const copyMe = useCallback(() => copyNode(Countdown.name, editor), [editor]);
  const deleteMe = useCallback(() => deleteNode(Countdown.name, editor), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="countdonw-bubble-menu"
      shouldShow={shouldShow}
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
