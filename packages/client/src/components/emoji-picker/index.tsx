import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Popover, Typography } from '@douyinfe/semi-ui';
import { EXPRESSIONES, GESTURES, SYMBOLS, OBJECTS, ACTIVITIES, SKY_WEATHER } from './constants';
import { setStorage, getStorage } from 'helpers/storage';
import { useToggle } from 'hooks/use-toggle';
import styles from './index.module.scss';

const { Title } = Typography;
const RECENT_USED_EMOJI_KEY = 'RECENT_USED_EMOJI_KEY';

const LIST = [
  {
    title: '表情',
    data: EXPRESSIONES,
  },
  {
    title: '天气',
    data: SKY_WEATHER,
  },
  {
    title: '手势',
    data: GESTURES,
  },
  {
    title: '符号',
    data: SYMBOLS,
  },
  {
    title: '物体',
    data: OBJECTS,
  },
  {
    title: '运动',
    data: ACTIVITIES,
  },
];

interface IProps {
  onSelectEmoji: (arg: string) => void;
}

export const EmojiPicker: React.FC<IProps> = ({ onSelectEmoji, children }) => {
  const [recentUsed, setRecentUsed] = useState([]);
  const [visible, toggleVisible] = useToggle(false);
  const renderedList = useMemo(
    () => (recentUsed.length ? [{ title: '最近使用', data: recentUsed }, ...LIST] : LIST),
    [recentUsed]
  );

  const selectEmoji = useCallback(
    (emoji) => {
      setStorage(RECENT_USED_EMOJI_KEY, [...recentUsed, emoji].join('-'));
      setRecentUsed((arr) => [...arr, emoji]);
      onSelectEmoji && onSelectEmoji(emoji);
    },
    [onSelectEmoji, recentUsed]
  );

  useEffect(() => {
    if (!visible) return;
    try {
      const recentUsed = getStorage(RECENT_USED_EMOJI_KEY);
      const toArr = recentUsed.split('-');
      setRecentUsed(toArr);
    } catch (e) {
      //
    }
  }, [visible]);

  return (
    <Popover
      showArrow
      zIndex={10000}
      trigger="click"
      position="bottomLeft"
      visible={visible}
      onVisibleChange={toggleVisible}
      content={
        <div className={styles.wrap}>
          {renderedList.map((item, index) => {
            return (
              <div key={item.title} className={styles.sectionWrap}>
                <Title heading={6} style={{ margin: `${index === 0 ? 0 : 16}px 0 6px` }}>
                  {item.title}
                </Title>
                <ul className={styles.listWrap}>
                  {(item.data || []).map((ex) => (
                    <li key={ex} onClick={() => selectEmoji(ex)}>
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
