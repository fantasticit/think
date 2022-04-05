import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Modal, Typography } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';
import { Editor } from '@tiptap/core';
import cls from 'classnames';
import scrollIntoView from 'scroll-into-view-if-needed';
import { useUser } from 'data/user';
import { useCollaborationDocument } from 'data/document';
import styles from './index.module.scss';

interface IProps {
  editor: Editor;
  items: Array<string>;
  command: any;
}

const { Title, Text } = Typography;

export const MentionList: React.FC<IProps> = forwardRef((props, ref) => {
  const $container = useRef<HTMLDivElement>();
  const router = useRouter();
  const { user: currentUser } = useUser();
  const { users, addUser, updateUser } = useCollaborationDocument(router.query.documentId);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index) => {
    const userName = props.items[index];
    if (!userName) return;
    props.command({ id: userName });

    // const currentUserAuth = users.find((user) => {
    //   return user.user.name === currentUser.name;
    // });
    // const isCurrentUserCreateUser = currentUserAuth.auth.createUserId === currentUser.id;

    // const target = users.find((user) => {
    //   return user.user.name === userName;
    // });

    // if (isCurrentUserCreateUser) {
    //   if (!target) {
    //     Modal.confirm({
    //       title: <Title heading={5}>权限操作</Title>,
    //       content: <Text>当前用户尚未加入该文档，是否添加他？</Text>,
    //       onCancel: () => {},
    //       onOk: async () => {
    //         addUser(userName).then((res) => {
    //           console.log('用户已经添加', res);
    //           props.command({ id: userName });
    //         });
    //       },
    //     });
    //   } else {
    //     if (!target.auth.readable) {
    //       Modal.confirm({
    //         title: <Title heading={5}>权限操作</Title>,
    //         content: <Text>当前用户无法阅读该文档，是否添加阅读权限？</Text>,
    //         onCancel: () => {},
    //         onOk: async () => {
    //           updateUser({
    //             userName,
    //             readable: true,
    //             editable: target.auth.editable,
    //           }).then((res) => {
    //             props.command({ id: userName });
    //           });
    //         },
    //       });
    //     } else {
    //       props.command({ id: userName });
    //     }
    //   }
    // } else {
    // }
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
    const el = $container.current.querySelector(`button:nth-of-type(${selectedIndex + 1})`);
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
          props.items.map((item, index) => (
            <button
              className={cls(styles.item, index === selectedIndex ? styles['is-selected'] : '')}
              key={index}
              onClick={() => selectItem(index)}
            >
              {item}
            </button>
          ))
        ) : (
          <div className={styles.item}>没有找到结果</div>
        )}
      </div>
    </div>
  );
});
