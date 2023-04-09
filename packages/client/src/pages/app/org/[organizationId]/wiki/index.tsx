import React from 'react';

import { List, TabPane, Tabs, Typography } from '@douyinfe/semi-ui';

import { WikiApiDefinition } from '@think/domains';

import { DataRender } from 'components/data-render';
import { Empty } from 'components/empty';
import { Seo } from 'components/seo';
import { WikiCard, WikiCardPlaceholder } from 'components/wiki/card';
import { WikiCreator } from 'components/wiki-creator';
import { getAllWikis, getJoinWikis, getOwnWikis, useAllWikis, useJoinWikis, useOwnWikis } from 'data/wiki';
import { useRouterQuery } from 'hooks/use-router-query';
import { CreateWikiIllustration } from 'illustrations/create-wiki';
import { AppSingleColumnLayout } from 'layouts/app-single-column';
import type { NextPage } from 'next';
import { serverPrefetcher } from 'services/server-prefetcher';

const grid = {
  gutter: 16,
  xs: 24,
  sm: 12,
  md: 12,
  lg: 8,
  xl: 8,
};

const { Title } = Typography;

const Wikis = ({ hook }) => {
  const { organizationId } = useRouterQuery<{ organizationId: string }>();
  const { data, loading, error } = hook(organizationId);

  return (
    <DataRender
      loading={loading}
      loadingContent={() => (
        <List
          grid={grid}
          dataSource={[1, 2, 3]}
          renderItem={() => (
            <List.Item>
              <WikiCardPlaceholder />
            </List.Item>
          )}
        />
      )}
      error={error}
      normalContent={() => (
        <List
          grid={grid}
          dataSource={data}
          renderItem={(wiki) => (
            <List.Item>
              <WikiCard wiki={wiki} />
            </List.Item>
          )}
          emptyContent={<Empty illustration={<CreateWikiIllustration />} message={<WikiCreator />} />}
        />
      )}
    />
  );
};

const Page: NextPage = () => {
  return (
    <AppSingleColumnLayout>
      <Seo title="知识库" />
      <div className="container">
        <Title heading={3} style={{ margin: '8px 0' }}>
          知识库
        </Title>
        <Tabs type="button" style={{ marginTop: 24 }}>
          <TabPane tab="全部" itemKey="all">
            <Wikis hook={useAllWikis} />
          </TabPane>
          <TabPane tab="我创建的" itemKey="own">
            <Wikis hook={useOwnWikis} />
          </TabPane>
          <TabPane tab="我参与的" itemKey="join">
            <Wikis hook={useJoinWikis} />
          </TabPane>
        </Tabs>
      </div>
    </AppSingleColumnLayout>
  );
};

Page.getInitialProps = async (ctx) => {
  const { orgId: organizationId } = ctx.query;

  const props = await serverPrefetcher(ctx, [
    { url: WikiApiDefinition.getAllWikis.client(organizationId), action: (cookie) => getAllWikis(cookie) },
    { url: WikiApiDefinition.getJoinWikis.client(organizationId), action: (cookie) => getJoinWikis(cookie) },
    { url: WikiApiDefinition.getOwnWikis.client(organizationId), action: (cookie) => getOwnWikis(cookie) },
  ]);
  return props;
};

export default Page;
