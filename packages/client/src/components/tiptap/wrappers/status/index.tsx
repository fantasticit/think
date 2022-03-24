import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Space, Popover, Tag, Input } from '@douyinfe/semi-ui';
import cls from 'classnames';
import styles from './index.module.scss';

export const StatusWrapper = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { color, text } = node.attrs;
  const content = (
    <Tag className="render-wrapper" color={color}>
      {text || '点击设置状态'}
    </Tag>
  );

  return (
    <NodeViewWrapper as="span" className={cls(styles.wrap, 'status')}>
      {isEditable ? (
        <Popover
          showArrow
          content={
            <>
              <div style={{ marginBottom: 8 }}>
                <Input autofocus placeholder="输入状态" onChange={(v) => updateAttributes({ text: v })} />
              </div>
              <Space>
                {['grey', 'red', 'green', 'orange', 'purple', 'teal'].map((color) => {
                  return (
                    <Tag
                      key={color}
                      style={{ width: 24, height: 24, cursor: 'pointer' }}
                      type="solid"
                      color={color as unknown as any}
                      onClick={() => updateAttributes({ color })}
                    ></Tag>
                  );
                })}
              </Space>
            </>
          }
          trigger="click"
        >
          {content}
        </Popover>
      ) : (
        content
      )}
      {/* <NodeViewContent></NodeViewContent> */}
    </NodeViewWrapper>
  );
};
