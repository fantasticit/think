import { IconHelpCircle } from '@douyinfe/semi-icons';
import { Popover, Space, TextArea, Typography } from '@douyinfe/semi-ui';
import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { useUser } from 'data/user';
import { useToggle } from 'hooks/use-toggle';
import katex from 'katex';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import styles from './index.module.scss';

const { Text } = Typography;

export const KatexWrapper = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { text, defaultShowPicker, createUser } = node.attrs;
  const { user } = useUser();
  const ref = useRef<HTMLTextAreaElement>();
  const [visible, toggleVisible] = useToggle(false);

  const formatText = useMemo(() => {
    try {
      return katex.renderToString(`${text}`);
    } catch (e) {
      return text;
    }
  }, [text]);

  const content = useMemo(
    () =>
      text.trim() ? (
        <span contentEditable={false} dangerouslySetInnerHTML={{ __html: formatText }}></span>
      ) : (
        <span contentEditable={false}>点击输入公式</span>
      ),
    [text, formatText]
  );

  const onVisibleChange = useCallback(
    (value) => {
      toggleVisible(value);
      if (defaultShowPicker && user && createUser === user.name) {
        updateAttributes({ defaultShowPicker: false });
      }
    },
    [defaultShowPicker, toggleVisible, updateAttributes, createUser, user]
  );

  useEffect(() => {
    if (defaultShowPicker && user && createUser === user.name) {
      toggleVisible(true);
      setTimeout(() => ref.current?.focus(), 100);
    }
  }, [defaultShowPicker, toggleVisible, createUser, user]);

  return (
    <NodeViewWrapper as="span" className={cls(styles.wrap, 'render-wrapper')} contentEditable={false}>
      {isEditable ? (
        <Popover
          showArrow
          position="bottomLeft"
          spacing={12}
          visible={visible}
          onVisibleChange={onVisibleChange}
          content={
            <div style={{ width: 320 }}>
              <TextArea
                ref={ref}
                autoFocus
                placeholder="输入公式"
                autosize
                rows={3}
                defaultValue={text}
                onChange={(v) => updateAttributes({ text: v })}
                style={{ marginBottom: 8 }}
              />
              <Text type="tertiary" link={{ href: 'https://katex.org/', target: '_blank' }}>
                <Space>
                  <IconHelpCircle />
                  查看帮助文档
                </Space>
              </Text>
            </div>
          }
          trigger="click"
        >
          {content}
        </Popover>
      ) : (
        content
      )}
    </NodeViewWrapper>
  );
};
