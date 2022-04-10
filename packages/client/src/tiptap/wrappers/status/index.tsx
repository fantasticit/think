import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Button, Collapsible, Space, Popover, Tag, Input } from '@douyinfe/semi-ui';
import cls from 'classnames';
import { useToggle } from 'hooks/use-toggle';
import styles from './index.module.scss';
import { useCallback, useEffect, useRef } from 'react';

const colors = [
  '#F5222D',
  '#FA541C',
  '#FA8C16',
  '#FADB14',
  '#52C41A',
  '#13C2C2',
  '#1890FF',
  '#2F54EB',
  '#722ED1',
  '#EB2F96',
  '#FFE8E6',
  '#FFECE0',
  '#FFEFD1',
  '#DEE8FC',
  '#EFE1FA',
  '#FAE1EB',
  '#FFA39E',
  '#FFBB96',
  '#FFD591',
  '#FFFB8F',
  '#B7EB8F',
  '#87E8DE',
  '#91D5FF',
  '#ADC6FF',
  '#D3ADF7',
  '#FFADD2',
  '#FF4D4F',
  '#FF7A45',
  '#FFA940',
  '#FFEC3D',
  '#73D13D',
  '#36CFC9',
  '#40A9FF',
  '#597EF7',
  '#9254DE',
  '#F759AB',
  '#CF1322',
  '#D4380D',
  '#D46B08',
  '#D4B106',
  '#389E0D',
  '#08979C',
];

export const StatusWrapper = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { color, text, defaultShowPicker } = node.attrs;
  const ref = useRef<HTMLInputElement>();
  const [visible, toggleVisible] = useToggle(false);
  const [isOpen, toggleOpen] = useToggle(false);

  const content = (
    <Tag className="render-wrapper" style={{ backgroundColor: color }}>
      {text || '点击设置状态'}
    </Tag>
  );

  const onVisibleChange = useCallback(
    (value) => {
      toggleVisible(value);
      if (defaultShowPicker) {
        updateAttributes({ defaultShowPicker: false });
      }
    },
    [defaultShowPicker, updateAttributes]
  );

  useEffect(() => {
    if (defaultShowPicker) {
      toggleVisible(true);
      setTimeout(() => ref.current?.focus(), 100);
    }
  }, [defaultShowPicker]);

  useEffect(() => {
    if (visible) {
      ref.current?.focus();
    }
  }, [visible]);

  return (
    <NodeViewWrapper as="span" className={cls(styles.wrap, 'status')}>
      <NodeViewContent />
      {isEditable ? (
        <Popover
          showArrow
          visible={visible}
          onVisibleChange={onVisibleChange}
          content={
            <div style={{ width: 216 }}>
              <div style={{ marginBottom: 8 }}>
                <Input ref={ref} placeholder="输入状态" onChange={(v) => updateAttributes({ text: v })} />
              </div>
              <Collapsible isOpen={isOpen} collapseHeight={28}>
                <Space wrap={true}>
                  {colors.map((color) => {
                    return (
                      <Tag
                        key={color}
                        style={{ width: 24, height: 24, cursor: 'pointer', background: color }}
                        type="solid"
                        onClick={() => updateAttributes({ color })}
                      />
                    );
                  })}
                </Space>
              </Collapsible>
              <div style={{ textAlign: 'right', marginTop: 8 }}>
                <Button size={'small'} onClick={toggleOpen}>
                  {isOpen ? '收起' : '更多'}
                </Button>
              </div>
            </div>
          }
          trigger="click"
        >
          {content}
        </Popover>
      ) : (
        content
      )}
      <NodeViewContent />
    </NodeViewWrapper>
  );
};
