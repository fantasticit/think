import { IconCopy, IconDelete, IconEdit, IconHelpCircle } from '@douyinfe/semi-icons';
import { Button, Popover, Space, TextArea, Typography } from '@douyinfe/semi-ui';
import { Divider } from 'components/divider';
import { Tooltip } from 'components/tooltip';
import { useUser } from 'data/user';
import { useToggle } from 'hooks/use-toggle';
import { useCallback, useEffect, useRef } from 'react';
import { Editor } from 'tiptap/core';
import { BubbleMenu } from 'tiptap/core/bubble-menu';
import { IKatexAttrs, Katex } from 'tiptap/core/extensions/katex';
import { useAttributes } from 'tiptap/core/hooks/use-attributes';
import { copyNode, deleteNode } from 'tiptap/prose-utils';

const { Text } = Typography;

export const KatexBubbleMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
  const attrs = useAttributes<IKatexAttrs>(editor, Katex.name, {
    text: '',
    defaultShowPicker: false,
    createUser: '',
  });
  const { text, defaultShowPicker, createUser } = attrs;
  const { user } = useUser();
  const ref = useRef<HTMLTextAreaElement>();
  const [visible, toggleVisible] = useToggle(false);
  const shouldShow = useCallback(() => editor.isActive(Katex.name), [editor]);
  const getRenderContainer = useCallback((node) => {
    return node;
  }, []);
  const copyMe = useCallback(() => copyNode(Katex.name, editor), [editor]);
  const deleteMe = useCallback(() => deleteNode(Katex.name, editor), [editor]);

  const submit = useCallback(() => {
    editor.chain().focus().setKatex({ text: ref.current.value, createUser }).run();
  }, [editor, createUser]);

  useEffect(() => {
    if (defaultShowPicker && user && createUser === user.id) {
      toggleVisible(true);
      editor.chain().updateAttributes(Katex.name, { defaultShowPicker: false }).focus().run();
    }
  }, [editor, defaultShowPicker, toggleVisible, createUser, user]);

  useEffect(() => {
    if (visible) {
      setTimeout(() => ref.current?.focus(), 200);
    }
  }, [visible]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="Katex-bubble-menu"
      shouldShow={shouldShow}
      getRenderContainer={getRenderContainer}
    >
      <Space spacing={4}>
        <Tooltip content="复制">
          <Button onClick={copyMe} icon={<IconCopy />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Popover
          showArrow
          position="topLeft"
          spacing={12}
          visible={visible}
          content={
            <div style={{ width: 320 }}>
              <TextArea
                ref={ref}
                autoFocus
                placeholder="输入公式"
                autosize
                rows={3}
                defaultValue={text}
                style={{ marginBottom: 8 }}
              />
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button onClick={submit}>提交</Button>
                <Text type="tertiary" link={{ href: 'https://katex.org/', target: '_blank' }}>
                  <Space>
                    <IconHelpCircle />
                    查看帮助文档
                  </Space>
                </Text>
              </Space>
            </div>
          }
          trigger="click"
          onVisibleChange={toggleVisible}
        >
          <Button size="small" type="tertiary" theme="borderless" icon={<IconEdit />} onClick={toggleVisible} />
        </Popover>

        <Divider />

        <Tooltip content="删除" hideOnClick>
          <Button size="small" type="tertiary" theme="borderless" icon={<IconDelete />} onClick={deleteMe} />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
