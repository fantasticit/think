import { IconChevronLeft } from '@douyinfe/semi-icons';
import { Button, Nav, Skeleton, Space, Tooltip, Typography } from '@douyinfe/semi-ui';
import { DataRender } from 'components/data-render';
import { Divider } from 'components/divider';
import { DocumentCollaboration } from 'components/document/collaboration';
import { DocumentStar } from 'components/document/star';
import { DocumentVersion } from 'components/document/version';
import { Seo } from 'components/seo';
import { Theme } from 'components/theme';
import { User } from 'components/user';
import { useDocumentDetail } from 'data/document';
import { useUser } from 'data/user';
import { CHANGE_DOCUMENT_TITLE, event, triggerUseDocumentVersion } from 'event';
import { triggerRefreshTocs } from 'event';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { useWindowSize } from 'hooks/use-window-size';
import { SecureDocumentIllustration } from 'illustrations/secure-document';
import Router from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { DocumentActions } from '../actions';
import { Editor } from './editor';
import styles from './index.module.scss';

const { Text } = Typography;

interface IProps {
  documentId: string;
}

const ErrorContent = () => {
  return (
    <div style={{ margin: '10vh', textAlign: 'center' }}>
      <SecureDocumentIllustration />
    </div>
  );
};

export const DocumentEditor: React.FC<IProps> = ({ documentId }) => {
  const { isMobile } = IsOnMobile.useHook();
  const { width: windowWith } = useWindowSize();
  const [title, setTitle] = useState('');
  const { user } = useUser();
  const { data: documentAndAuth, loading: docAuthLoading, error: docAuthError } = useDocumentDetail(documentId);
  const { document, authority } = documentAndAuth || {};

  const goback = useCallback(() => {
    Router.push({
      pathname: `/app/org/[organizationId]/wiki/[wikiId]/doc/[documentId]`,
      query: { organizationId: document.organizationId, wikiId: document.wikiId, documentId: document.id },
    }).then(() => {
      triggerRefreshTocs();
    });
  }, [document]);

  const actions = useMemo(
    () => (
      <Space>
        {document && authority.readable && (
          <DocumentCollaboration key={documentId} wikiId={document.wikiId} documentId={documentId} />
        )}
        {document && (
          <DocumentStar
            key="star"
            organizationId={document.organizationId}
            wikiId={document.wikiId}
            documentId={documentId}
          />
        )}
        {document && (
          <DocumentActions organizationId={document.organizationId} wikiId={document.wikiId} documentId={documentId} />
        )}
        <DocumentVersion key={'edit'} documentId={documentId} onSelect={triggerUseDocumentVersion} />
      </Space>
    ),
    [documentId, document, authority]
  );

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
              <Button onMouseDown={goback} icon={<IconChevronLeft />} style={{ marginRight: 16 }} />
              <DataRender
                loading={docAuthLoading}
                error={docAuthError}
                loadingContent={
                  <Skeleton active placeholder={<Skeleton.Title style={{ width: 80 }} />} loading={true} />
                }
                normalContent={() => (
                  <Text
                    ellipsis={{
                      showTooltip: { opts: { content: title, style: { wordBreak: 'break-all' } } },
                    }}
                    style={{ width: ~~(windowWith / 4) }}
                  >
                    {title}
                  </Text>
                )}
              />
            </>
          }
          footer={
            <>
              {isMobile ? null : (
                <>
                  {actions}
                  <Divider />
                </>
              )}
              <Theme />
              <User />
            </>
          }
        />
        {isMobile && <div className={styles.mobileToolbar}>{actions}</div>}
      </header>
      <main className={styles.contentWrap}>
        <DataRender
          loading={docAuthLoading}
          error={docAuthError}
          errorContent={<ErrorContent />}
          normalContent={() => {
            return (
              <>
                {document && <Seo title={document.title} />}
                {user && <Editor user={user} documentId={documentId} authority={authority} />}
              </>
            );
          }}
        />
      </main>
    </div>
  );
};
