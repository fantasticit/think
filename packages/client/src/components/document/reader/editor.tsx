import React, { useMemo, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Layout } from '@douyinfe/semi-ui';
import { IDocument, ILoginUser } from '@think/domains';
import { useToggle } from 'hooks/use-toggle';
import {
  DEFAULT_EXTENSION,
  DocumentWithTitle,
  getCollaborationExtension,
  getCollaborationCursorExtension,
  getProvider,
  destoryProvider,
} from 'tiptap';
import { DataRender } from 'components/data-render';
import { ImageViewer } from 'components/image-viewer';
import { joinUser } from 'components/document/collaboration';
import { CreateUser } from './user';
import styles from './index.module.scss';

const { Content } = Layout;

interface IProps {
  user: ILoginUser;
  documentId: string;
  document: IDocument;
}

export const Editor: React.FC<IProps> = ({ user, documentId, document }) => {
  if (!user) return null;

  const provider = useMemo(() => {
    return getProvider({
      targetId: documentId,
      token: user.token,
      cacheType: 'READER',
      user,
      docType: 'document',
      events: {
        onAwarenessUpdate({ states }) {
          joinUser({ states });
        },
      },
    });
  }, [documentId, user.token]);
  const editor = useEditor({
    editable: false,
    extensions: [
      ...DEFAULT_EXTENSION,
      DocumentWithTitle,
      getCollaborationExtension(provider),
      getCollaborationCursorExtension(provider, user),
    ],
  });
  const [loading, toggleLoading] = useToggle(true);

  useEffect(() => {
    provider.on('synced', () => {
      toggleLoading(false);
    });

    return () => {
      destoryProvider(provider, 'READER');
    };
  }, []);

  return (
    <DataRender
      loading={loading}
      error={null}
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
          </Content>
        );
      }}
    />
  );
};
