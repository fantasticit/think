import { IconEdit } from '@douyinfe/semi-icons';
import { Button, Layout, Nav, Skeleton, Space, Spin, Tooltip, Typography } from '@douyinfe/semi-ui';
import { DataRender } from 'components/data-render';
import { DocumentCollaboration } from 'components/document/collaboration';
import { DocumentStar } from 'components/document/star';
import { DocumentStyle } from 'components/document/style';
import { DocumentVersion } from 'components/document/version';
import { Seo } from 'components/seo';
import { useDocumentDetail } from 'data/document';
import { useUser } from 'data/user';
import { triggerJoinUser } from 'event';
import { useMount } from 'hooks/use-mount';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { useWindowSize } from 'hooks/use-window-size';
import Router from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { CollaborationEditor } from 'tiptap/editor';

import { DocumentActions } from '../actions';
import { DocumentFullscreen } from '../fullscreen';
import { Author } from './author';
import styles from './index.module.scss';

const { Header } = Layout;
const { Text } = Typography;

interface IProps {
  documentId: string;
}

const loadingStyle = {
  minHeight: 240,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 'auto',
};

export const DocumentReader: React.FC<IProps> = ({ documentId }) => {
  const { isMobile } = IsOnMobile.useHook();
  const mounted = useMount();
  const { width: windowWidth } = useWindowSize();
  const { user } = useUser();
  const { data: documentAndAuth, loading: docAuthLoading, error: docAuthError } = useDocumentDetail(documentId);
  const { document, authority } = documentAndAuth || {};

  const [readable, editable] = useMemo(() => {
    if (!authority) return [false, false];
    return [authority.readable, authority.editable];
  }, [authority]);

  const renderAuthor = useCallback(
    (element) => {
      if (!document) return null;
      const target = element && element.querySelector('.ProseMirror .title');

      if (target) {
        return createPortal(<Author document={document} />, target);
      }

      return null;
    },
    [document]
  );

  const gotoEdit = useCallback(() => {
    Router.push({
      pathname: `/app/org/[organizationId]/wiki/[wikiId]/doc/[documentId]/edit`,
      query: { organizationId: document.organizationId, wikiId: document.wikiId, documentId: document.id },
    });
  }, [document]);

  const actions = useMemo(() => {
    return (
      <Space>
        {document && (
          <DocumentCollaboration
            disabled={!readable}
            key={documentId}
            wikiId={document.wikiId}
            documentId={documentId}
          />
        )}
        {document && !isMobile && <DocumentFullscreen data={document} />}
        {document && (
          <DocumentStar
            disabled={!readable}
            key="star"
            organizationId={document.organizationId}
            wikiId={document.wikiId}
            documentId={documentId}
          />
        )}
        <DocumentStyle key="style" />
        <Tooltip key="edit" content="编辑" position="bottom">
          <Button disabled={!editable} icon={<IconEdit />} onMouseDown={gotoEdit} />
        </Tooltip>
        {document && (
          <DocumentActions
            organizationId={document.organizationId}
            wikiId={document.wikiId}
            documentId={documentId}
            document={document}
          />
        )}
        <DocumentVersion documentId={documentId} />
      </Space>
    );
  }, [document, documentId, readable, editable, gotoEdit, isMobile]);

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
                  style={{ width: isMobile ? windowWidth - 100 : ~~(windowWidth / 3) }}
                >
                  {document.title}
                </Text>
              )}
            />
          }
          footer={isMobile ? <></> : actions}
        ></Nav>
      </Header>
      <Layout className={styles.contentWrap}>
        <DataRender
          loading={docAuthLoading}
          loadingContent={
            <div style={loadingStyle}>
              <Spin />
            </div>
          }
          error={docAuthError}
          normalContent={() => (
            <>
              <Seo title={document.title} />
              {mounted && (
                <CollaborationEditor
                  editable={false}
                  user={user}
                  id={documentId}
                  type="document"
                  renderInEditorPortal={renderAuthor}
                  onAwarenessUpdate={triggerJoinUser}
                />
              )}
            </>
          )}
        />
      </Layout>
      {isMobile && <div className={styles.mobileToolbar}>{actions}</div>}
    </div>
  );
};
