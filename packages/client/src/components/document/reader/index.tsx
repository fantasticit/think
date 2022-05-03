import Router from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import cls from 'classnames';
import {
  Layout,
  Nav,
  Space,
  Avatar,
  Button,
  Typography,
  Skeleton,
  Tooltip,
  Popover,
  BackTop,
  Spin,
} from '@douyinfe/semi-ui';
import { LocaleTime } from 'components/locale-time';
import { IconUser, IconEdit, IconArticle } from '@douyinfe/semi-icons';
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
import { triggerJoinUser } from 'event';
import { CollaborationEditor } from 'tiptap/editor';
import styles from './index.module.scss';

const { Header } = Layout;
const { Text } = Typography;
const EditBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 30,
  width: 30,
  borderRadius: '100%',
  backgroundColor: '#0077fa',
  color: '#fff',
  bottom: 100,
  transform: 'translateY(-50px)',
};

interface IProps {
  documentId: string;
}

export const DocumentReader: React.FC<IProps> = ({ documentId }) => {
  const [container, setContainer] = useState<HTMLDivElement>();
  const { width: windowWidth } = useWindowSize();
  const { width, fontSize } = useDocumentStyle();
  const editorWrapClassNames = useMemo(() => {
    return width === 'standardWidth' ? styles.isStandardWidth : styles.isFullWidth;
  }, [width]);
  const { user } = useUser();
  const { data: documentAndAuth, loading: docAuthLoading, error: docAuthError } = useDocumentDetail(documentId);
  const { document, authority } = documentAndAuth || {};

  const renderAuthor = useCallback(
    (element) => {
      if (!document) return null;

      const target = element && element.querySelector('.ProseMirror .title');

      if (target) {
        return createPortal(
          <div
            style={{
              borderTop: '1px solid var(--semi-color-border)',
              marginTop: 24,
              padding: '16px 0',
              fontSize: 13,
              fontWeight: 'normal',
              color: 'var(--semi-color-text-0)',
            }}
          >
            <Space>
              <Avatar size="small" src={document.createUser && document.createUser.avatar}>
                <IconUser />
              </Avatar>
              <div>
                <p style={{ margin: 0 }}>
                  创建者：
                  {document.createUser && document.createUser.name}
                </p>
                <p style={{ margin: '8px 0 0' }}>
                  最近更新日期：
                  <LocaleTime date={document.updatedAt} timeago />
                  {' ⦁ '}阅读量：
                  {document.views}
                </p>
              </div>
            </Space>
          </div>,
          target
        );
      }

      return null;
    },
    [document]
  );

  const gotoEdit = useCallback(() => {
    Router.push(`/wiki/${document.wikiId}/document/${document.id}/edit`);
  }, [document]);

  if (!documentId) return null;

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
                <Text
                  strong
                  ellipsis={{
                    showTooltip: { opts: { content: document.title, style: { wordBreak: 'break-all' } } },
                  }}
                  style={{ width: ~~(windowWidth / 4) }}
                >
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
              loadingContent={
                <div style={{ margin: '10vh auto' }}>
                  <Spin tip="正在为您读取文档中...">
                    {/* FIXME: semi-design 的问题，不加 div，文字会换行! */}
                    <div></div>
                  </Spin>
                </div>
              }
              normalContent={() => {
                return (
                  <>
                    <Seo title={document.title} />
                    {user && (
                      <CollaborationEditor
                        editable={false}
                        user={user}
                        id={documentId}
                        type="document"
                        renderInEditorPortal={renderAuthor}
                        onAwarenessUpdate={triggerJoinUser}
                      />
                    )}
                    {user && (
                      <div className={styles.commentWrap}>
                        <CommentEditor documentId={document.id} />
                      </div>
                    )}
                    {authority && authority.editable && container && (
                      <BackTop style={EditBtnStyle} onClick={gotoEdit} target={() => container} visibilityHeight={200}>
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
