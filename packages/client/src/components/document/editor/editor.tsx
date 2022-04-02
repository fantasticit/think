import React, { useMemo, useEffect, useState } from 'react';
import cls from 'classnames';
import { useEditor, EditorContent } from '@tiptap/react';
import { BackTop } from '@douyinfe/semi-ui';
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
import { DataRender } from 'components/data-render';
import { joinUser } from 'components/document/collaboration';
import { Banner } from 'components/banner';
import { debounce } from 'helpers/debounce';
import { em, changeTitle, USE_DATA_VERSION } from './index';
import styles from './index.module.scss';

interface IProps {
  user: ILoginUser;
  documentId: string;
  authority: IAuthority;
  className: string;
  style: React.CSSProperties;
}

export const Editor: React.FC<IProps> = ({ user, documentId, authority, className, style }) => {
  if (!user) return null;
  const [status, setStatus] = useState<ProviderStatus>('connecting');
  const { online } = useNetwork();
  const provider = useMemo(() => {
    return getProvider({
      targetId: documentId,
      token: user.token,
      cacheType: 'EDITOR',
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
    editable: authority && authority.editable,
    extensions: [
      ...BaseKit,
      DocumentWithTitle,
      getCollaborationExtension(provider),
      getCollaborationCursorExtension(provider, user),
    ],
    onTransaction: debounce(({ transaction }) => {
      try {
        const title = transaction.doc.content.firstChild.content.firstChild.textContent;
        changeTitle(title);
      } catch (e) {}
    }, 50),
  });
  const [loading, toggleLoading] = useToggle(true);

  useEffect(() => {
    const indexdbProvider = getIndexdbProvider(documentId, provider.document);

    indexdbProvider.on('synced', () => {
      setStatus('loadCacheSuccess');
    });

    provider.on('synced', () => {
      toggleLoading(false);
    });

    provider.on('status', async ({ status }) => {
      setStatus(status);
    });

    return () => {
      destoryProvider(provider, 'EDITOR');
      destoryIndexdbProvider(documentId);
    };
  }, []);

  useEffect(() => {
    if (!editor) return;
    const handler = (data) => editor.commands.setContent(data);
    em.on(USE_DATA_VERSION, handler);

    return () => {
      em.off(USE_DATA_VERSION, handler);
    };
  }, [editor]);

  return (
    <DataRender
      loading={loading}
      error={null}
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
          </div>
        );
      }}
    />
  );
};
