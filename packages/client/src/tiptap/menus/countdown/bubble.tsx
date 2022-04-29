import { useCallback } from 'react';
import { Space, Button } from '@douyinfe/semi-ui';
import { IconEdit, IconCopy, IconDelete } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { BubbleMenu } from 'tiptap/views/bubble-menu';
import { Countdown } from 'tiptap/extensions/countdown';
import { Divider } from 'tiptap/divider';
import { copyNode, deleteNode } from 'tiptap/prose-utils';
import { triggerOpenCountSettingModal } from '../_event';

export const CountdownBubbleMenu = ({ editor }) => {
  const attrs = editor.getAttributes(Countdown.name);

  const openEditLinkModal = useCallback(() => {
    triggerOpenCountSettingModal(attrs);
  }, [attrs]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="countdonw-bubble-menu"
      shouldShow={() => editor.isActive(Countdown.name)}
      tippyOptions={{ maxWidth: 'calc(100vw - 100px)' }}
    >
      <Space>
        <Tooltip content="复制">
          <Button
            onClick={() => copyNode(Countdown.name, editor)}
            icon={<IconCopy />}
            type="tertiary"
            theme="borderless"
            size="small"
          />
        </Tooltip>

        <Tooltip content="编辑">
          <Button size="small" type="tertiary" theme="borderless" icon={<IconEdit />} onClick={openEditLinkModal} />
        </Tooltip>

        <Divider />

        <Tooltip content="删除节点" hideOnClick>
          <Button
            onClick={() => deleteNode(Countdown.name, editor)}
            icon={<IconDelete />}
            type="tertiary"
            theme="borderless"
            size="small"
          />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
