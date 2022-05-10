import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Popover, Typography, SideSheet } from '@douyinfe/semi-ui';
import { EXPRESSIONES, GESTURES, SYMBOLS, OBJECTS, ACTIVITIES, SKY_WEATHER } from './constants';
import { createKeysLocalStorageLRUCache } from 'helpers/lru-cache';
import { useToggle } from 'hooks/use-toggle';
import styles from './index.module.scss';
import { useWindowSize } from 'hooks/use-window-size';

const { Title } = Typography;

const emojiLocalStorageLRUCache = createKeysLocalStorageLRUCache('EMOJI_PICKER', 20);

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
  const { isMobile } = useWindowSize();
  const [recentUsed, setRecentUsed] = useState([]);
  const [visible, toggleVisible] = useToggle(false);
  const renderedList = useMemo(
    () => (recentUsed.length ? [{ title: '最近使用', data: recentUsed }, ...LIST] : LIST),
    [recentUsed]
  );

  const selectEmoji = useCallback(
    (emoji) => {
      emojiLocalStorageLRUCache.put(emoji);
      setRecentUsed(emojiLocalStorageLRUCache.get() as string[]);
      onSelectEmoji && onSelectEmoji(emoji);
    },
    [onSelectEmoji]
  );

  const content = useMemo(
    () => (
      <div className={styles.wrap} style={{ padding: isMobile ? '24px 0' : 0 }}>
        {renderedList.map((item, index) => {
          return (
            <div key={item.title}>
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
    ),
    [isMobile, renderedList, selectEmoji]
  );

  useEffect(() => {
    if (!visible) return;
    emojiLocalStorageLRUCache.syncFromStorage();
    setRecentUsed(emojiLocalStorageLRUCache.get() as string[]);
  }, [visible]);

  return (
    <span>
      {isMobile ? (
        <>
          <SideSheet
            headerStyle={{ borderBottom: '1px solid var(--semi-color-border)' }}
            placement="bottom"
            title={'表情'}
            visible={visible}
            onCancel={toggleVisible}
            height={370}
            mask={false}
          >
            {content}
          </SideSheet>
          <span onMouseDown={() => toggleVisible(true)}>{children}</span>
        </>
      ) : (
        <Popover
          showArrow
          zIndex={10000}
          trigger="click"
          position="bottomLeft"
          visible={visible}
          onVisibleChange={toggleVisible}
          content={<div style={{ width: 320 }}>{content}</div>}
        >
          {children}
        </Popover>
      )}
    </span>
  );
};
