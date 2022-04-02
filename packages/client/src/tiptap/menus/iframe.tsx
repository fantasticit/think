import { useCallback, useRef } from 'react';
import { Space, Button, Modal, Form, Typography } from '@douyinfe/semi-ui';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { IconEdit, IconExternalOpen, IconLineHeight, IconDelete } from '@douyinfe/semi-icons';
import { useToggle } from 'hooks/use-toggle';
import { Tooltip } from 'components/tooltip';
import { BubbleMenu } from '../views/bubble-menu';
import { Iframe } from '../extensions/iframe';
import { Divider } from '../divider';
import { Size } from './size';

const { Text } = Typography;

const EXAMPLE_LINK =
  'https://proxy.tencentsuite.com/openapi/proxy/v2/addon?uid=144115212008575217&creator=144115212008575217&redirect=https%3A%2F%2Fi.y.qq.com%2Fn2%2Fm%2Foutchain%2Fplayer%2Findex.html%3Fsongid%3D5408217&docType=1&docID=300000000$RwqOunTcpXjs&addonID=0b69e1b9517e44a4aee35d33ee021b55&packageID=817&nonce=m3rqxn';

export const IframeBubbleMenu = ({ editor }) => {
  const attrs = editor.getAttributes(Iframe.name);
  const { width, height, url } = attrs;
  const $form = useRef<FormApi>();
  const [visible, toggleVisible] = useToggle(false);

  const useExample = useCallback(() => {
    $form.current.setValue('url', EXAMPLE_LINK);
  }, []);

  const handleCancel = useCallback(() => {
    toggleVisible(false);
  }, []);

  const handleOk = useCallback(() => {
    $form.current.validate().then((values) => {
      editor
        .chain()
        .updateAttributes(Iframe.name, {
          url: values.url,
        })
        .setNodeSelection(editor.state.selection.from)
        .focus()
        .run();
      toggleVisible(false);
    });
  }, []);

  const visitLink = useCallback(() => {
    window.open(url, '_blank');
  }, [url]);

  const openEditLinkModal = useCallback(() => {
    toggleVisible(true);
  }, []);

  const setSize = useCallback(
    (size) => {
      editor.chain().updateAttributes(Iframe.name, size).setNodeSelection(editor.state.selection.from).focus().run();
    },
    [editor]
  );

  const deleteNode = useCallback(() => editor.chain().deleteSelection().run(), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="link-bubble-menu"
      shouldShow={() => editor.isActive(Iframe.name)}
      tippyOptions={{ maxWidth: 456 }}
    >
      <Modal
        title="编辑链接"
        visible={visible}
        onOk={handleOk}
        onCancel={() => toggleVisible(false)}
        centered
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text type="tertiary" style={{ cursor: 'pointer' }} onClick={useExample}>
              查看示例
            </Text>
            <div>
              <Button type="secondary" onClick={handleCancel}>
                取消
              </Button>
              <Button theme="solid" onClick={handleOk}>
                确认
              </Button>
            </div>
          </div>
        }
      >
        <Form initValues={{ url }} getFormApi={(formApi) => ($form.current = formApi)} labelPosition="left">
          <Form.Input autofocus label="链接" field="url" placeholder="请输入外链地址"></Form.Input>
        </Form>
      </Modal>

      <Space>
        <Tooltip content="访问链接">
          <Button size="small" type="tertiary" theme="borderless" icon={<IconExternalOpen />} onClick={visitLink} />
        </Tooltip>

        <Tooltip content="编辑链接">
          <Button size="small" type="tertiary" theme="borderless" icon={<IconEdit />} onClick={openEditLinkModal} />
        </Tooltip>

        <Size width={width} height={height} onOk={setSize}>
          <Tooltip content="设置宽高">
            <Button icon={<IconLineHeight />} type="tertiary" theme="borderless" size="small" />
          </Tooltip>
        </Size>

        <Divider />

        <Tooltip content="删除节点">
          <Button onClick={deleteNode} icon={<IconDelete />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
