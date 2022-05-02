import Router from 'next/router';
import React, { useMemo, useEffect, useState, useRef } from 'react';
import cls from 'classnames';
import { BackTop, Toast, Spin, Typography } from '@douyinfe/semi-ui';
import { ILoginUser, IAuthority } from '@think/domains';
import { SecureDocumentIllustration } from 'illustrations/secure-document';
import { useToggle } from 'hooks/use-toggle';
import { useNetwork } from 'hooks/use-network';
import {
  useEditor,
  EditorContent,
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

const { Text } = Typography;

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
    provider.on('status', async ({ status }) => {
      setStatus(status);
    });

    return () => {
      destoryProvider(provider, 'EDITOR');
    };
  }, [documentId, provider, authority]);

  useEffect(() => {
    if (!authority || !authority.editable) return;

    const indexdbProvider = getIndexdbProvider(documentId, provider.document);

    indexdbProvider.on('synced', () => {
      setStatus('loadCacheSuccess');
    });

    return () => {
      destoryIndexdbProvider(documentId);
    };
  }, [documentId, provider, authority]);

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
      loadingContent={
        <div style={{ margin: '10vh auto' }}>
          <Spin tip="正在为您加载编辑器中...">
            {/* FIXME: semi-design 的问题，不加 div，文字会换行! */}
            <div></div>
          </Spin>
        </div>
      }
      error={error}
      errorContent={(error) => (
        <div
          style={{
            margin: '10vh',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <SecureDocumentIllustration />
          <Text style={{ marginTop: 12 }} type="danger">
            {(error && error.message) || '未知错误'}
          </Text>
        </div>
      )}
      normalContent={() => {
        return (
          <div className={styles.editorWrap}>
            {(!online || status === 'disconnected') && (
              <Banner
                type="warning"
                description="我们已与您断开连接，您可以继续编辑文档。一旦重新连接，我们会自动重新提交数据。"
              />
            )}
            {authority && !authority.editable && (
              <Banner type="warning" description="您没有编辑权限，暂不能编辑该文档。" closeable={false} />
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
