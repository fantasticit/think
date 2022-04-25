import Router from 'next/router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import cls from 'classnames';
import { Layout, Nav, Space, Button, Typography, Skeleton, Tooltip, Popover, BackTop } from '@douyinfe/semi-ui';
import { IconEdit, IconArticle } from '@douyinfe/semi-icons';
import { Seo } from 'components/seo';
import { DataRender } from 'components/data-render';
import { DocumentShare } from 'components/document/share';
import { DocumentStar } from 'components/document/star';
import { DocumentCollaboration } from 'components/document/collaboration';
import { DocumentStyle } from 'components/document/style';
import { DocumentVersion } from 'components/document/version';
import { CommentEditor } from 'components/document/comments';
import { useDocumentStyle } from 'hooks/use-document-style';
import { useWindowSize } from 'hooks/use-window-size';
import { useUser } from 'data/user';
import { useDocumentDetail } from 'data/document';
import { DocumentSkeleton } from 'tiptap';
import { Editor } from './editor';
import styles from './index.module.scss';

const { Header } = Layout;
const { Text } = Typography;

interface IProps {
  documentId: string;
}

export const DocumentReader: React.FC<IProps> = ({ documentId }) => {
  if (!documentId) return null;

  const [container, setContainer] = useState<HTMLDivElement>();
  const { width: windowWidth } = useWindowSize();
  const { width, fontSize } = useDocumentStyle();
  const editorWrapClassNames = useMemo(() => {
    return width === 'standardWidth' ? styles.isStandardWidth : styles.isFullWidth;
  }, [width]);
  const { user } = useUser();
  const { data: documentAndAuth, loading: docAuthLoading, error: docAuthError } = useDocumentDetail(documentId);
  const { document, authority } = documentAndAuth || {};

  const gotoEdit = useCallback(() => {
    Router.push(`/wiki/${document.wikiId}/document/${document.id}/edit`);
  }, [document]);

  return (
    <div className={styles.wrap}>
      <Header className={styles.headerWrap}>
        <Nav
          style={{ overflow: 'auto', paddingLeft: 0, paddingRight: 0 }}
          mode="horizontal"
          header={
            <DataRender
              loading={docAuthLoading}
              error={docAuthError}
              loadingContent={<Skeleton active placeholder={<Skeleton.Title style={{ width: 80 }} />} loading={true} />}
              normalContent={() => (
                <Text strong ellipsis={{ showTooltip: true }} style={{ width: ~~(windowWidth / 4) }}>
                  {document.title}
                </Text>
              )}
            />
          }
          footer={
            <Space>
              {document && authority.readable && (
                <DocumentCollaboration key="collaboration" wikiId={document.wikiId} documentId={documentId} />
              )}
              {authority && authority.editable && (
                <Tooltip key="edit" content="编辑" position="bottom">
                  <Button icon={<IconEdit />} onClick={gotoEdit} />
                </Tooltip>
              )}
              {authority && authority.readable && (
                <>
                  <DocumentShare key="share" documentId={documentId} />
                  <DocumentVersion key="version" documentId={documentId} />
                  <DocumentStar key="star" documentId={documentId} />
                </>
              )}
              <Popover key="style" zIndex={1061} position="bottomLeft" content={<DocumentStyle />}>
                <Button icon={<IconArticle />} theme="borderless" type="tertiary" />
              </Popover>
            </Space>
          }
        ></Nav>
      </Header>
      <Layout className={styles.contentWrap}>
        <div ref={setContainer}>
          <div className={cls(styles.editorWrap, editorWrapClassNames)} style={{ fontSize }}>
            <DataRender
              loading={docAuthLoading}
              error={docAuthError}
              loadingContent={<DocumentSkeleton />}
              normalContent={() => {
                return (
                  <>
                    <Seo title={document.title} />
                    {user && (
                      <Editor key={document.id} user={user} documentId={document.id} document={document}>
                        <div className={styles.commentWrap}>
                          <CommentEditor documentId={document.id} />
                        </div>
                      </Editor>
                    )}
                    {authority && authority.editable && container && (
                      <BackTop
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: 30,
                          width: 30,
                          borderRadius: '100%',
                          backgroundColor: '#0077fa',
                          color: '#fff',
                          bottom: 100,
                          transform: `translateY(-50px);`,
                        }}
                        onClick={gotoEdit}
                        target={() => container}
                        visibilityHeight={200}
                      >
                        <IconEdit />
                      </BackTop>
                    )}
                    {container && <BackTop target={() => container} />}
                  </>
                );
              }}
            />
          </div>
        </div>
      </Layout>
    </div>
  );
};
