import { Button, Popover, SideSheet, TabPane, Tabs } from '@douyinfe/semi-ui';
import { createKeysLocalStorageLRUCache } from 'helpers/lru-cache';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ACTIVITIES, EXPRESSIONES, GESTURES, OBJECTS, SKY_WEATHER, SYMBOLS } from './constants';
import styles from './index.module.scss';

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
  showClear?: boolean;
  onSelectEmoji: (arg: string) => void;
}

export const EmojiPicker: React.FC<IProps> = ({ showClear = false, onSelectEmoji, children }) => {
  const { isMobile } = IsOnMobile.useHook();
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

  const clear = useCallback(() => {
    onSelectEmoji('');
  }, [onSelectEmoji]);

  const content = useMemo(
    () =>
      !visible ? null : (
        <div className={styles.wrap}>
          <Tabs
            size="small"
            lazyRender
            keepDOM
            tabBarExtraContent={
              showClear ? (
                <Button size="small" onClick={clear}>
                  清除
                </Button>
              ) : null
            }
            collapsible
          >
            {renderedList.map((list) => {
              return (
                <TabPane
                  key={list.title}
                  tab={list.title}
                  itemKey={list.title}
                  style={{ height: 250, overflow: 'auto' }}
                >
                  <div className={styles.listWrap}>
                    {(list.data || []).map((ex) => (
                      <div key={ex} onClick={() => selectEmoji(ex)}>
                        {ex}
                      </div>
                    ))}
                  </div>
                </TabPane>
              );
            })}
          </Tabs>
        </div>
      ),
    [visible, showClear, renderedList, selectEmoji, clear]
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
            height={400}
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
          content={<div style={{ width: 320, maxWidth: '96vw' }}>{content}</div>}
        >
          {children}
        </Popover>
      )}
    </span>
  );
};
