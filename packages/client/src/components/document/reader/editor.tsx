import React, { useMemo, useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Layout } from '@douyinfe/semi-ui';
import { IDocument, ILoginUser } from '@think/domains';
import { useToggle } from 'hooks/use-toggle';
import {
  BaseKit,
  DocumentWithTitle,
  getCollaborationExtension,
  getCollaborationCursorExtension,
  getProvider,
  destoryProvider,
  DocumentSkeleton,
} from 'tiptap';
import { DataRender } from 'components/data-render';
import { ImageViewer } from 'components/image-viewer';
import { triggerJoinUser } from 'event';
import { CreateUser } from './user';
import styles from './index.module.scss';

const { Content } = Layout;

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
  }, [documentId, user.token]);
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
  }, []);

  return (
    <DataRender
      loading={loading}
      loadingContent={<DocumentSkeleton />}
      error={error}
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
