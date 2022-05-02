import Router from 'next/router';
import React, { useMemo, useEffect, useState, useRef } from 'react';
import cls from 'classnames';
import { useEditor, EditorContent } from '@tiptap/react';
import { BackTop, Toast } from '@douyinfe/semi-ui';
import { ILoginUser, IAuthority } from '@think/domains';
import { useToggle } from 'hooks/use-toggle';
import { useNetwork } from 'hooks/use-network';
import {
  MenuBar,
  BaseKit,
  DocumentWithTitle,
  getCollaborationExtension,
  getCollaborationCursorExtension,
  getProvider,
  destoryProvider,
  ProviderStatus,
  getIndexdbProvider,
  destoryIndexdbProvider,
} from 'tiptap';
import { findMentions } from 'tiptap/prose-utils';
import { useCollaborationDocument } from 'data/document';
import { DataRender } from 'components/data-render';
import { Banner } from 'components/banner';
import { LogoName } from 'components/logo';
import { debounce } from 'helpers/debounce';
import { event, triggerChangeDocumentTitle, triggerJoinUser, USE_DOCUMENT_VERSION } from 'event';
import { DocumentUserSetting } from './users';
import styles from './index.module.scss';

interface IProps {
  user: ILoginUser;
  documentId: string;
  authority: IAuthority;
  className: string;
  style: React.CSSProperties;
}

export const Editor: React.FC<IProps> = ({ user: currentUser, documentId, authority, className, style }) => {
  const $hasShowUserSettingModal = useRef(false);
  const { users, addUser, updateUser } = useCollaborationDocument(documentId);
  const [status, setStatus] = useState<ProviderStatus>('connecting');
  const { online } = useNetwork();
  const [loading, toggleLoading] = useToggle(true);
  const [error, setError] = useState(null);
  const provider = useMemo(() => {
    return getProvider({
      targetId: documentId,
      token: currentUser.token,
      cacheType: 'EDITOR',
      user: currentUser,
      docType: 'document',
      events: {
        onAwarenessUpdate({ states }) {
          triggerJoinUser(states);
        },
        onAuthenticationFailed() {
          toggleLoading(false);
          setError(new Error('鉴权失败！暂时无法提供服务'));
        },
        onSynced() {
          toggleLoading(false);
        },
      },
    });
  }, [documentId, currentUser, toggleLoading]);
  const editor = useEditor(
    {
      editable: authority && authority.editable,
      extensions: [
        ...BaseKit,
        DocumentWithTitle,
        getCollaborationExtension(provider),
        getCollaborationCursorExtension(provider, currentUser),
      ],
      onTransaction: debounce(({ transaction }) => {
        try {
          const title = transaction.doc.content.firstChild.content.firstChild.textContent;
          triggerChangeDocumentTitle(title);
        } catch (e) {
          //
        }
      }, 50),
    },
    [authority, provider]
  );
  const [mentionUsersSettingVisible, toggleMentionUsersSettingVisible] = useToggle(false);
  const [mentionUsers, setMentionUsers] = useState([]);

  useEffect(() => {
    const indexdbProvider = getIndexdbProvider(documentId, provider.document);

    indexdbProvider.on('synced', () => {
      setStatus('loadCacheSuccess');
    });

    provider.on('status', async ({ status }) => {
      setStatus(status);
    });

    return () => {
      destoryProvider(provider, 'EDITOR');
      destoryIndexdbProvider(documentId);
    };
  }, [documentId, provider]);

  useEffect(() => {
    if (!editor) return;
    const handler = (data) => editor.commands.setContent(data);
    event.on(USE_DOCUMENT_VERSION, handler);

    return () => {
      event.off(USE_DOCUMENT_VERSION, handler);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const handler = () => {
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
  }, [editor, users, currentUser, toggleMentionUsersSettingVisible]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.keyCode == 83) {
        event.preventDefault();
        Toast.info(`${LogoName}会实时保存你的数据，无需手动保存。`);
        return false;
      }
    };

    window.document.addEventListener('keydown', listener);

    return () => {
      window.document.removeEventListener('keydown', listener);
    };
  }, []);

  return (
    <DataRender
      loading={loading}
      error={error}
      normalContent={() => {
        return (
          <div className={styles.editorWrap}>
            {(!online || status === 'disconnected') && (
              <Banner
                type="warning"
                description="我们已与您断开连接，您可以继续编辑文档。一旦重新连接，我们会自动重新提交数据。"
              />
            )}
            <header className={className}>
              <div>
                <MenuBar editor={editor} />
              </div>
            </header>
            <main id="js-template-editor-container" style={style}>
              <div className={cls(styles.contentWrap, className)}>
                <EditorContent editor={editor} />
              </div>
              <BackTop target={() => document.querySelector('#js-template-editor-container')} />
            </main>
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
      }}
    />
  );
};
