import { IAuthority, ILoginUser } from '@think/domains';
import cls from 'classnames';
import { useDoumentMembers } from 'data/document';
import { event, triggerChangeDocumentTitle, triggerJoinUser, USE_DOCUMENT_VERSION } from 'event';
import { useMount } from 'hooks/use-mount';
import { useToggle } from 'hooks/use-toggle';
import Router from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { CollaborationEditor, ICollaborationRefProps } from 'tiptap/editor';
import { findMentions } from 'tiptap/prose-utils';

import styles from './index.module.scss';
import { DocumentUserSetting } from './users';

interface IProps {
  user: ILoginUser;
  documentId: string;
  authority: IAuthority;
}

export const Editor: React.FC<IProps> = ({ user: currentUser, documentId, authority }) => {
  const $hasShowUserSettingModal = useRef(false);
  const $editor = useRef<ICollaborationRefProps>();
  const mounted = useMount();
  const { users, addUser, updateUser } = useDoumentMembers(documentId);
  const [mentionUsersSettingVisible, toggleMentionUsersSettingVisible] = useToggle(false);
  const [mentionUsers, setMentionUsers] = useState([]);

  useEffect(() => {
    const handler = (data) => {
      const editor = $editor.current && $editor.current.getEditor();
      if (!editor) return;
      editor.commands.setContent(data);
    };
    event.on(USE_DOCUMENT_VERSION, handler);

    return () => {
      event.off(USE_DOCUMENT_VERSION, handler);
    };
  }, []);

  useEffect(() => {
    const handler = () => {
      const editor = $editor.current && $editor.current.getEditor();
      if (!editor) return;

      // 已经拦截过一次，不再拦截
      if ($hasShowUserSettingModal.current) return;

      const mentionUsers = findMentions(editor);
      if (!mentionUsers || !mentionUsers.length) return;

      const currentUserAuth = users.find((user) => {
        return user.user.name === currentUser.name;
      });
      const isCurrentUserCreateUser = currentUserAuth.auth.createUserId === currentUser.id;

      if (!isCurrentUserCreateUser) {
        return;
      }

      const data = Array.from(new Set(mentionUsers))
        .filter((userName) => {
          const exist = users.find((user) => {
            return user.user.name === userName;
          });
          if (!exist || !exist.auth.readable) return true;
          return false;
        })
        .filter(Boolean);

      if (!data.length) return;

      setMentionUsers(data);
      toggleMentionUsersSettingVisible(true);
      $hasShowUserSettingModal.current = true;
      // ignore-me
      const newErr = new Error('请完成权限操作后关闭页面');
      throw newErr;
    };

    Router.events.on('routeChangeStart', handler);
    window.addEventListener('unload', handler);

    return () => {
      $hasShowUserSettingModal.current = false;
      Router.events.off('routeChangeStart', handler);
      window.removeEventListener('unload', handler);
    };
  }, [users, currentUser, toggleMentionUsersSettingVisible]);

  return (
    <div className={cls(styles.editorWrap)}>
      {mounted && (
        <CollaborationEditor
          ref={$editor}
          menubar
          editable={authority && authority.editable}
          user={currentUser}
          id={documentId}
          type="document"
          onTitleUpdate={triggerChangeDocumentTitle}
          onAwarenessUpdate={triggerJoinUser}
        />
      )}
      <DocumentUserSetting
        visible={mentionUsersSettingVisible}
        toggleVisible={toggleMentionUsersSettingVisible}
        mentionUsers={mentionUsers}
        users={users}
        addUser={addUser}
        updateUser={updateUser}
      />
    </div>
  );
};
