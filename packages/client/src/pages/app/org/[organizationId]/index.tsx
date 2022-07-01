import { Avatar, Button, List, Table, Typography } from '@douyinfe/semi-ui';
import { DocumentApiDefinition, IDocument, IOrganization, StarApiDefinition } from '@think/domains';
import { DataRender } from 'components/data-render';
import { DocumentActions } from 'components/document/actions';
import { Empty } from 'components/empty';
import { LocaleTime } from 'components/locale-time';
import { Seo } from 'components/seo';
import { WikiCreator } from 'components/wiki/create';
import { WikiPinCard, WikiPinCardPlaceholder } from 'components/wiki/pin-card';
import { getRecentVisitedDocuments, useRecentDocuments } from 'data/document';
import { getStarWikisInOrganization, useStarWikisInOrganization } from 'data/star';
import { useRouterQuery } from 'hooks/use-router-query';
import { useToggle } from 'hooks/use-toggle';
import { AppSingleColumnLayout } from 'layouts/app-single-column';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useEffect, useMemo } from 'react';
import { serverPrefetcher } from 'services/server-prefetcher';

import styles from './index.module.scss';

const { Title } = Typography;
const { Column } = Table;

const grid = {
  gutter: 16,
  xs: 24,
  sm: 12,
  md: 12,
  lg: 8,
  xl: 8,
};

const RecentDocs = () => {
  const { organizationId } = useRouterQuery<{ organizationId: string }>();
  const { data, error, loading, refresh } = useRecentDocuments(organizationId);

  const columns = useMemo(
    () => [
      <Column
        title="标题"
        dataIndex="title"
        key="title"
        width={200}
        render={(_, document: IDocument) => {
          return (
            <Link
              href={{
                pathname: `/app/org/[organizationId]/wiki/[wikiId]/doc/[documentId]`,
                query: { organizationId: document.organizationId, wikiId: document.wikiId, documentId: document.id },
              }}
            >
              <a style={{ color: 'inherit', textDecoration: 'none' }}>{document.title}</a>
            </Link>
          );
        }}
      />,
      <Column width={100} title="阅读量" dataIndex="views" key="views" />,
      <Column
        title="创建者"
        dataIndex="createUser"
        key="createUser"
        width={160}
        render={(createUser) => {
          return (
            <span>
              <Avatar size="extra-extra-small" src={createUser.avatar} style={{ marginRight: 4 }}>
                {createUser.name.slice(0, 1)}
              </Avatar>
              {createUser.name}
            </span>
          );
        }}
      />,
      <Column
        width={120}
        title="访问时间"
        dataIndex="visitedAt"
        key="visitedAt"
        render={(date) => <LocaleTime date={date} />}
      />,
      <Column
        title="操作"
        dataIndex="operate"
        key="operate"
        width={80}
        render={(_, document) => (
          <DocumentActions
            organizationId={document.organizationId}
            wikiId={document.wikiId}
            documentId={document.id}
            onDelete={refresh}
            showCreateDocument
            hideDocumentVersion
            hideDocumentStyle
          />
        )}
      />,
    ],
    [refresh]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <>
      <Title heading={3} style={{ margin: '24px 0 0' }}>
        最近访问
      </Title>
      <DataRender
        loading={loading}
        loadingContent={
          <Table dataSource={[]} loading={true} pagination={false} size="small" style={{ marginTop: 16 }}>
            {columns}
          </Table>
        }
        error={error}
        normalContent={() =>
          data && data.length ? (
            <Table dataSource={data} loading={loading} pagination={false} size="small" style={{ marginTop: 16 }}>
              {columns}
            </Table>
          ) : (
            <Empty message="最近访问的文档会出现在此处" />
          )
        }
      />
    </>
  );
};

const Page: NextPage<{ organizationId: IOrganization['id'] }> = ({ organizationId }) => {
  const [visible, toggleVisible] = useToggle(false);
  const { data: staredWikis, loading, error, refresh } = useStarWikisInOrganization(organizationId);

  return (
    <AppSingleColumnLayout>
      <Seo title="主页" />
      <div className="container">
        <div className={styles.titleWrap}>
          <Title heading={3} style={{ margin: '8px 0' }}>
            快捷访问
          </Title>
          <>
            <Button onClick={toggleVisible}>创建知识库</Button>
            <WikiCreator visible={visible} toggleVisible={toggleVisible} />
          </>
        </div>
        <DataRender
          loading={loading}
          loadingContent={() => (
            <List
              grid={grid}
              dataSource={[1, 2, 3]}
              renderItem={() => (
                <List.Item>
                  <WikiPinCardPlaceholder />
                </List.Item>
              )}
            />
          )}
          error={error}
          normalContent={() => (
            <List
              grid={grid}
              dataSource={staredWikis}
              renderItem={(wiki) => (
                <List.Item>
                  <WikiPinCard wiki={wiki} />
                </List.Item>
              )}
              emptyContent={<Empty message="收藏的知识库会出现在此处" />}
            />
          )}
        />
        <RecentDocs />
      </div>
    </AppSingleColumnLayout>
  );
};

Page.getInitialProps = async (ctx) => {
  const { organizationId } = ctx.query;

  const props = await serverPrefetcher(ctx, [
    {
      url: StarApiDefinition.getStarWikisInOrganization.client(organizationId),
      action: (cookie) => getStarWikisInOrganization(organizationId, cookie),
    },
    {
      url: DocumentApiDefinition.recent.client(organizationId),
      action: (cookie) => getRecentVisitedDocuments(organizationId, cookie),
    },
  ]);
  return { ...props, organizationId } as any;
};

export default Page;
