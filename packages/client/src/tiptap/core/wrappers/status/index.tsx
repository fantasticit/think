import { IconTick } from '@douyinfe/semi-icons';
import { Input, Popover, Space, Tag } from '@douyinfe/semi-ui';
import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { useUser } from 'data/user';
import { useToggle } from 'hooks/use-toggle';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import styles from './index.module.scss';

export const STATUS_COLORS = [
  // 按钮背景 文字颜色 背景颜色 边框颜色
  ['rgb(223, 225, 230)', '#42526E', '#DFE1E6', 'rgb(80, 95, 121)'],
  ['rgb(234, 230, 255)', '#403294', '#EAE6FF', 'rgb(82, 67, 170)'],
  ['rgb(222, 235, 255)', '#0747A6', '#DEEBFF', 'rgb(0, 82, 204)'],
  ['rgb(255, 235, 230)', '#BF2600', '#FFECE6', 'rgb(222, 53, 11)'],
  ['rgb(255, 240, 179)', '#172B4D', '#FFF0B3', 'rgb(255, 153, 31)'],
  ['rgb(227, 252, 239)', '#006644', '#E3FCEF', 'rgb(0, 135, 90)'],
];

export const StatusWrapper = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { color: currentTextColor, bgcolor, borderColor, text, defaultShowPicker, createUser } = node.attrs;
  const { user } = useUser();
  const ref = useRef<HTMLInputElement>();
  const [visible, toggleVisible] = useToggle(false);
  const [currentText, setCurrentText] = useState(text);

  const content = useMemo(
    () => (
      <Tag className="render-wrapper" style={{ backgroundColor: bgcolor, border: `1px solid ${borderColor}` }}>
        <span style={{ color: currentTextColor }}>{currentText || '点击设置状态'}</span>
      </Tag>
    ),
    [bgcolor, borderColor, currentTextColor, currentText]
  );

  const onVisibleChange = useCallback(
    (value) => {
      toggleVisible(value);
      if (defaultShowPicker && user && user.id === createUser) {
        updateAttributes({ defaultShowPicker: false });
      }
    },
    [defaultShowPicker, toggleVisible, updateAttributes, createUser, user]
  );

  const setColor = useCallback(
    (color) => () => {
      updateAttributes({
        color: color[1],
        bgcolor: color[2],
      });
    },
    [updateAttributes]
  );

  useEffect(() => {
    if (defaultShowPicker && user && user.id === createUser) {
      toggleVisible(true);
      setTimeout(() => ref.current?.focus(), 200);
    }
  }, [defaultShowPicker, toggleVisible, createUser, user]);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        ref.current?.focus();
      }, 200);
    } else {
      updateAttributes({ text: currentText });
    }
  }, [visible, updateAttributes, currentText]);

  return (
    <NodeViewWrapper as="span" className={cls(styles.wrap, 'status')}>
      {isEditable ? (
        <Popover
          showArrow
          position="bottomLeft"
          visible={visible}
          onVisibleChange={onVisibleChange}
          content={
            <div style={{ width: 184, height: 65 }}>
              <div style={{ marginBottom: 8 }}>
                <Input ref={ref} placeholder="输入状态" value={currentText} onChange={setCurrentText} />
              </div>
              <Space>
                {STATUS_COLORS.map((color) => {
                  return (
                    <Tag
                      key={color[0]}
                      style={{
                        width: 24,
                        height: 24,
                        cursor: 'pointer',
                        background: color[0],
                        border: `1px solid ${color[3]}`,
                      }}
                      type="solid"
                      onClick={setColor(color)}
                    >
                      {currentTextColor === color[1] ? <IconTick style={{ color: color[1] }} /> : null}
                    </Tag>
                  );
                })}
              </Space>
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
