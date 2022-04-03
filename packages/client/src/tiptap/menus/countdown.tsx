import { useCallback, useRef } from 'react';
import { Space, Button, Modal, Form, Typography } from '@douyinfe/semi-ui';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { IconEdit, IconExternalOpen, IconLineHeight, IconDelete } from '@douyinfe/semi-icons';
import { useToggle } from 'hooks/use-toggle';
import { Tooltip } from 'components/tooltip';
import { BubbleMenu } from '../views/bubble-menu';
import { Countdown } from '../extensions/countdown';
import { Divider } from '../divider';
import { event, triggerOpenCountSettingModal } from './event';

export const CountdownBubbleMenu = ({ editor }) => {
  const attrs = editor.getAttributes(Countdown.name);
  const $form = useRef<FormApi>();
  // const [visible, toggleVisible] = useToggle(false);

  // const useExample = useCallback(() => {
  //   $form.current.setValue('url', EXAMPLE_LINK);
  // }, []);

  // const handleCancel = useCallback(() => {
  //   toggleVisible(false);
  // }, []);

  // const handleOk = useCallback(() => {
  //   $form.current.validate().then((values) => {
  //     editor
  //       .chain()
  //       .updateAttributes(Countdown.name, {
  //         url: values.url,
  //       })
  //       .setNodeSelection(editor.state.selection.from)
  //       .focus()
  //       .run();
  //     toggleVisible(false);
  //   });
  // }, []);

  const openEditLinkModal = useCallback(() => {
    triggerOpenCountSettingModal(attrs);
  }, [attrs]);

  const deleteNode = useCallback(() => editor.chain().deleteSelection().run(), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="countdonw-bubble-menu"
      shouldShow={() => editor.isActive(Countdown.name)}
      tippyOptions={{ maxWidth: 456 }}
    >
      <Space>
        <Tooltip content="编辑">
          <Button size="small" type="tertiary" theme="borderless" icon={<IconEdit />} onClick={openEditLinkModal} />
        </Tooltip>

        <Divider />

        <Tooltip content="删除节点" hideOnClick>
          <Button onClick={deleteNode} icon={<IconDelete />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
