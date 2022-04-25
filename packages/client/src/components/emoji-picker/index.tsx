import React from 'react';
import { Popover, Typography } from '@douyinfe/semi-ui';
import { EXPRESSIONES, GESTURES, SYMBOLS } from './constants';
import styles from './index.module.scss';

const { Title } = Typography;

const LIST = [
  {
    title: '符号',
    data: SYMBOLS,
  },
  {
    title: '表情',
    data: EXPRESSIONES,
  },
  {
    title: '手势',
    data: GESTURES,
  },
];

interface IProps {
  onSelectEmoji: (arg: string) => void;
}

export const EmojiPicker: React.FC<IProps> = ({ onSelectEmoji, children }) => {
  return (
    <Popover
      showArrow
      zIndex={10000}
      trigger="click"
      position="bottomLeft"
      content={
        <div className={styles.wrap}>
          {LIST.map((item, index) => {
            return (
              <div key={item.title} className={styles.sectionWrap}>
                <Title heading={6} style={{ margin: `${index === 0 ? 0 : 16}px 0 6px` }}>
                  {item.title}
                </Title>
                <ul className={styles.listWrap}>
                  {(item.data || []).map((ex) => (
                    <li key={ex} onClick={() => onSelectEmoji(ex)}>
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      }
    >
      <span>{children}</span>
    </Popover>
  );
};
