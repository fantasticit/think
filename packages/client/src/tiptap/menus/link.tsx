import { useEffect, useState, useRef, useCallback } from 'react';
import { Space, Button, Modal, Form, Toast } from '@douyinfe/semi-ui';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { IconExternalOpen, IconUnlink, IconEdit } from '@douyinfe/semi-icons';
import { useToggle } from 'hooks/use-toggle';
import { Tooltip } from 'components/tooltip';
import { Divider } from '../divider';
import { BubbleMenu } from '../views/bubble-menu';
import { Link } from '../extensions/link';
import { isMarkActive } from '../services/is-active';
import { findMarkPosition } from '../services/find-position';
import { isValidURL } from '../services/valid-url';

export const LinkBubbleMenu = ({ editor }) => {
  const attrs = editor.getAttributes(Link.name);
  const { href, target } = attrs;
  const isLinkActive = editor.isActive(Link.name);
  const $form = useRef<FormApi>();
  const [visible, toggleVisible] = useToggle(false);
  const [text, setText] = useState();

  const handleCancel = useCallback(() => {
    toggleVisible(false);
  }, []);

  const handleOk = useCallback(() => {
    $form.current.validate().then((values) => {
      if (!values.href) {
        Toast.error('请输入有效链接');
        return;
      }

      if (!values.text) {
        values.text = values.href;
      }

      if (values.text !== text && values.text) {
        editor.chain().extendMarkRange(Link.name).run();
        const { view } = editor;
        const schema = view.state.schema;
        const node = schema.text(values.text, [schema.marks.link.create({ href: values.href })]);
        view.dispatch(view.state.tr.replaceSelectionWith(node, true).scrollIntoView());
      } else {
        editor
          .chain()
          .extendMarkRange(Link.name)
          .updateAttributes(Link.name, {
            href: values.href,
          })
          .focus()
          .run();
      }
      toggleVisible(false);
    });
  }, []);

  const visitLink = useCallback(() => {
    window.open(href, target);
  }, [href, target]);

  const openEditLinkModal = useCallback(() => {
    toggleVisible(true);
  }, []);

  const unsetLink = useCallback(() => editor.chain().extendMarkRange(Link.name).unsetLink().run(), [editor]);

  useEffect(() => {
    if (!isLinkActive) return;

    const { state } = editor;
    const isInLink = isMarkActive(state.schema.marks.link)(state);

    if (!isInLink) return;

    const { $head } = editor.state.selection;
    const marks = $head.marks();
    if (!marks.length) return;

    const mark = marks[0];
    const node = $head.node($head.depth);
    const startPosOfThisLine = $head.pos - $head.parentOffset;
    const endPosOfThisLine = startPosOfThisLine + node.content.size;
    const { start, end } = findMarkPosition(state, mark, startPosOfThisLine, endPosOfThisLine);
    const text = state.doc.textBetween(start, end);
    setText(text);
  });

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="link-bubble-menu"
      shouldShow={() => editor.isActive(Link.name)}
      tippyOptions={{ maxWidth: 456 }}
    >
      <Modal title="编辑链接" visible={visible} onOk={handleOk} onCancel={handleCancel} centered>
        <Form initValues={{ text, href }} getFormApi={(formApi) => ($form.current = formApi)} labelPosition="left">
          <Form.Input label="文本" field="text" placeholder="请输入文本"></Form.Input>
          <Form.Input
            autofocus
            label="链接"
            field="href"
            placeholder="请输入外链地址"
            rules={[{ validator: (_, value) => isValidURL(value), message: '请输入有效链接' }]}
          ></Form.Input>
        </Form>
      </Modal>

      <Space>
        <Tooltip content="访问链接">
          <Button size="small" type="tertiary" theme="borderless" icon={<IconExternalOpen />} onClick={visitLink} />
        </Tooltip>

        <Tooltip content="编辑链接">
          <Button size="small" type="tertiary" theme="borderless" icon={<IconEdit />} onClick={openEditLinkModal} />
        </Tooltip>

        <Divider />

        <Tooltip content="去除链接" hideOnClick>
          <Button onClick={unsetLink} icon={<IconUnlink />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
