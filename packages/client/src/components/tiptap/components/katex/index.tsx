import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useMemo } from 'react';
import { Popover, TextArea, Typography, Space } from '@douyinfe/semi-ui';
import { IconHelpCircle } from '@douyinfe/semi-icons';
import katex from 'katex';
import styles from './index.module.scss';

const { Text } = Typography;

export const KatexWrapper = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { text } = node.attrs;
  const formatText = useMemo(() => {
    try {
      return katex.renderToString(`${text}`);
    } catch (e) {
      return text;
    }
  }, [text]);

  const content = text ? (
    <span contentEditable={false} dangerouslySetInnerHTML={{ __html: formatText }}></span>
  ) : (
    <span contentEditable={false}>请输入公式</span>
  );

  return (
    <NodeViewWrapper as="div" className={styles.wrap} contentEditable={false}>
      {isEditable ? (
        <Popover
          showArrow
          content={
            <div style={{ width: 320 }}>
              <TextArea
                autofocus
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
      <NodeViewContent></NodeViewContent>
    </NodeViewWrapper>
  );
};
