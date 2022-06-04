import { Space } from '@douyinfe/semi-ui';
import { Editor } from '@tiptap/core';
import cls from 'classnames';
import { useUser } from 'data/user';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { ILabelRenderCommand } from 'tiptap/core/menus/commands';

import styles from './index.module.scss';

interface IProps {
  editor: Editor;
  items: ILabelRenderCommand[];
  command: (command: ILabelRenderCommand) => void;
}

export const MenuList: React.FC<IProps> = forwardRef((props, ref) => {
  const { user } = useUser();
  const $container = useRef<HTMLDivElement>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index) => {
    const command = props.items[index];

    if (command) {
      // 注入用户信息
      command.user = user;
      props.command(command);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useEffect(() => {
    if (Number.isNaN(selectedIndex + 1)) return;
    const el = $container.current.querySelector(`span:nth-of-type(${selectedIndex + 1})`);
    el && scrollIntoView(el, { behavior: 'smooth', scrollMode: 'if-needed' });
  }, [selectedIndex]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className={styles.items}>
      <div ref={$container}>
        {props.items.length ? (
          props.items.map((item, index) => {
            return (
              <span
                className={cls(styles.item, index === selectedIndex ? styles['is-selected'] : '')}
                key={index}
                onClick={() => selectItem(index)}
              >
                <Space>
                  {item.icon}
                  {item.label}
                </Space>
              </span>
            );
          })
        ) : (
          <div className={styles.item}>没有找到结果</div>
        )}
      </div>
    </div>
  );
});

MenuList.displayName = 'MenuList';
