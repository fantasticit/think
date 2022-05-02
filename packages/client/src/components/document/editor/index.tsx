import Router from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Nav, Skeleton, Typography, Space, Button, Tooltip, Spin, Popover } from '@douyinfe/semi-ui';
import { IconChevronLeft, IconArticle } from '@douyinfe/semi-icons';
import { useUser } from 'data/user';
import { useDocumentDetail } from 'data/document';
import { useWindowSize } from 'hooks/use-window-size';
import { SecureDocumentIllustration } from 'illustrations/secure-document';
import { Seo } from 'components/seo';
import { Theme } from 'components/theme';
import { DataRender } from 'components/data-render';
import { DocumentShare } from 'components/document/share';
import { DocumentStar } from 'components/document/star';
import { DocumentCollaboration } from 'components/document/collaboration';
import { DocumentStyle } from 'components/document/style';
import { DocumentVersion } from 'components/document/version';
import { User } from 'components/user';
import { Divider } from 'components/divider';
import { useDocumentStyle } from 'hooks/use-document-style';
import { event, CHANGE_DOCUMENT_TITLE, triggerUseDocumentVersion } from 'event';
import { Editor } from './editor';
import styles from './index.module.scss';

const { Text } = Typography;

interface IProps {
  documentId: string;
}

export const DocumentEditor: React.FC<IProps> = ({ documentId }) => {
  const { width: windowWith } = useWindowSize();
  const { width, fontSize } = useDocumentStyle();
  const editorWrapClassNames = useMemo(() => {
    return width === 'standardWidth' ? styles.isStandardWidth : styles.isFullWidth;
  }, [width]);
  const [title, setTitle] = useState('');
  const { user } = useUser();
  const { data: documentAndAuth, loading: docAuthLoading, error: docAuthError } = useDocumentDetail(documentId);
  const { document, authority } = documentAndAuth || {};

  const goback = useCallback(() => {
    Router.push({
      pathname: `/wiki/${document.wikiId}/document/${documentId}`,
    });
  }, [document, documentId]);

  useEffect(() => {
    event.on(CHANGE_DOCUMENT_TITLE, setTitle);

    return () => {
      event.off(CHANGE_DOCUMENT_TITLE, setTitle);
    };
  }, []);

  return (
    <div className={styles.wrap}>
      <header>
        <Nav
          className={styles.headerOuterWrap}
          mode="horizontal"
          header={
            <>
              <Tooltip content="返回" position="bottom">
                <Button onClick={goback} icon={<IconChevronLeft />} style={{ marginRight: 16 }} />
              </Tooltip>
              <DataRender
                loading={docAuthLoading}
                error={docAuthError}
                loadingContent={
                  <Skeleton active placeholder={<Skeleton.Title style={{ width: 80 }} />} loading={true} />
                }
                normalContent={() => (
                  <Text ellipsis={{ showTooltip: true }} style={{ width: ~~(windowWith / 4) }}>
                    {title}
                  </Text>
                )}
              />
            </>
          }
          footer={
            <Space>
              {document && authority.readable && (
                <DocumentCollaboration key="collaboration" wikiId={document.wikiId} documentId={documentId} />
              )}
              <DocumentShare key="share" documentId={documentId} />
              <DocumentVersion key="version" documentId={documentId} onSelect={triggerUseDocumentVersion} />
              <DocumentStar key="star" documentId={documentId} />
              <Popover key="style" zIndex={1061} position="bottomLeft" content={<DocumentStyle />}>
                <Button icon={<IconArticle />} theme="borderless" type="tertiary" />
              </Popover>
              <Theme />
              <Divider />
              <User />
            </Space>
          }
        />
      </header>
      <main className={styles.contentWrap}>
        <DataRender
          loading={docAuthLoading}
          loadingContent={
            <div style={{ margin: '10vh auto' }}>
              <Spin tip="正在为您读取文档中...">
                {/* FIXME: semi-design 的问题，不加 div，文字会换行! */}
                <div></div>
              </Spin>
            </div>
          }
          error={docAuthError}
          errorContent={
            <div style={{ margin: '10vh', textAlign: 'center' }}>
              <SecureDocumentIllustration />
            </div>
          }
          normalContent={() => {
            return (
              <>
                <Seo title={document.title} />
                <Editor
                  key={document.id}
                  user={user}
                  documentId={document.id}
                  authority={authority}
                  className={editorWrapClassNames}
                  style={{ fontSize }}
                />
              </>
            );
          }}
        />
      </main>
    </div>
  );
};
