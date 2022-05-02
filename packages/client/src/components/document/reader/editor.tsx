import React, { useMemo, useEffect, useState } from 'react';
import { Layout, Spin, Typography } from '@douyinfe/semi-ui';
import { IDocument, ILoginUser } from '@think/domains';
import { useToggle } from 'hooks/use-toggle';
import {
  useEditor,
  EditorContent,
  BaseKit,
  DocumentWithTitle,
  getCollaborationExtension,
  getCollaborationCursorExtension,
  getProvider,
  destoryProvider,
} from 'tiptap';
import { SecureDocumentIllustration } from 'illustrations/secure-document';
import { DataRender } from 'components/data-render';
import { ImageViewer } from 'components/image-viewer';
import { triggerJoinUser } from 'event';
import { CreateUser } from './user';
import styles from './index.module.scss';

const { Content } = Layout;
const { Text } = Typography;

interface IProps {
  user: ILoginUser;
  documentId: string;
  document: IDocument;
}

export const Editor: React.FC<IProps> = ({ user, documentId, document, children }) => {
  const [loading, toggleLoading] = useToggle(true);
  const [error, setError] = useState(null);
  const provider = useMemo(() => {
    return getProvider({
      targetId: documentId,
      token: user.token,
      cacheType: 'READER',
      user,
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
  }, [documentId, user, toggleLoading]);
  const editor = useEditor({
    editable: false,
    extensions: [
      ...BaseKit,
      DocumentWithTitle,
      getCollaborationExtension(provider),
      getCollaborationCursorExtension(provider, user),
    ],
    editorProps: {
      // @ts-ignore
      taskItemClickable: true,
    },
  });

  useEffect(() => {
    return () => {
      destoryProvider(provider, 'READER');
    };
  }, [provider]);

  return (
    <DataRender
      loading={loading}
      loadingContent={
        <div style={{ margin: '10vh auto' }}>
          <Spin tip="正在为您加载文档内容中...">
            {/* FIXME: semi-design 的问题，不加 div，文字会换行! */}
            <div />
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
          <Content className={styles.editorWrap}>
            <div id="js-reader-container">
              <ImageViewer containerSelector="#js-reader-container" />
              <EditorContent editor={editor} />
            </div>
            <CreateUser
              document={document}
              container={() => window.document.querySelector('#js-reader-container .ProseMirror .title')}
            />
            {children}
          </Content>
        );
      }}
    />
  );
};
