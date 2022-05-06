import React, { useMemo, useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Typography, Spin } from '@douyinfe/semi-ui';
import { IndexeddbPersistence } from 'y-indexeddb';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { useToggle } from 'hooks/use-toggle';
import { SecureDocumentIllustration } from 'illustrations/secure-document';
import { DataRender } from 'components/data-render';
import { debounce } from 'helpers/debounce';
import { Editor } from '../../react';
import { ICollaborationEditorProps, ProviderStatus } from './type';
import { EditorInstance } from './editor';
import styles from './index.module.scss';

const { Text } = Typography;

export type ICollaborationRefProps = {
  getEditor: () => Editor;
};

export const CollaborationEditor = forwardRef((props: ICollaborationEditorProps, ref) => {
  const {
    id: documentId,
    type,
    editable,
    onTitleUpdate,
    user,
    menubar,
    renderInEditorPortal,
    onAwarenessUpdate,
  } = props;
  const $editor = useRef<Editor>();
  const [loading, toggleLoading] = useToggle(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState<ProviderStatus>('connecting');

  const hocuspocusProvider = useMemo(() => {
    return new HocuspocusProvider({
      url: process.env.COLLABORATION_API_URL,
      name: documentId,
      token: (user && user.token) || 'read-public',
      parameters: {
        targetId: documentId,
        userId: user && user.id,
        docType: type,
      },
      maxAttempts: 1,
      onAwarenessUpdate: debounce(({ states }) => {
        const users = states.map((state) => ({ clientId: state.clientId, user: state.user }));
        onAwarenessUpdate && onAwarenessUpdate(users);
      }, 200),
      onAuthenticationFailed() {
        toggleLoading(false);
        setError(new Error('鉴权失败！暂时无法提供服务'));
      },
      onSynced() {
        toggleLoading(false);
      },
      onStatus({ status }) {
        setStatus(status);
      },
    } as any);
  }, [documentId, user, type, onAwarenessUpdate, toggleLoading]);

  useImperativeHandle(
    ref,
    () =>
      ({
        getEditor: () => $editor.current,
      } as ICollaborationRefProps)
  );

  // 离线缓存
  useEffect(() => {
    if (!editable) return;
    const indexdbProvider = new IndexeddbPersistence(documentId, hocuspocusProvider.document);
    indexdbProvider.on('synced', () => {
      setStatus('loadCacheSuccess');
    });

    return () => {
      if (indexdbProvider) {
        indexdbProvider.destroy();
      }
    };
  }, [editable, documentId, hocuspocusProvider]);

  useEffect(() => {
    return () => {
      if (hocuspocusProvider) {
        hocuspocusProvider.destroy();
      }
    };
  }, [hocuspocusProvider]);

  return (
    <div className={styles.wrap}>
      <DataRender
        loading={loading}
        loadingContent={
          <div style={{ width: 174, margin: 'auto' }}>
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
              margin: '10%',
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
        normalContent={() => (
          <EditorInstance
            ref={$editor}
            editable={editable}
            menubar={menubar}
            hocuspocusProvider={hocuspocusProvider}
            onTitleUpdate={onTitleUpdate}
            user={user}
            status={status}
            renderInEditorPortal={renderInEditorPortal}
          />
        )}
      />
    </div>
  );
});

CollaborationEditor.displayName = 'CollaborationEditor';
