import { List, Typography } from '@douyinfe/semi-ui';
import { StarApiDefinition } from '@think/domains';
import { DataRender } from 'components/data-render';
import { DocumentCard, DocumentCardPlaceholder } from 'components/document/card';
import { Empty } from 'components/empty';
import { Seo } from 'components/seo';
import { WikiCard, WikiCardPlaceholder } from 'components/wiki/card';
import {
  getStarDocumentsInOrganization,
  getStarWikisInOrganization,
  useStarDocumentsInOrganization,
  useStarWikisInOrganization,
} from 'data/star';
import { useRouterQuery } from 'hooks/use-router-query';
import { AppSingleColumnLayout } from 'layouts/app-single-column';
import type { NextPage } from 'next';
import React from 'react';
import { serverPrefetcher } from 'services/server-prefetcher';

import styles from './index.module.scss';

const { Title } = Typography;

const grid = {
  gutter: 16,
  xs: 24,
  sm: 12,
  md: 12,
  lg: 8,
  xl: 8,
};

const StarDocs = () => {
  const { organizationId } = useRouterQuery<{ organizationId: string }>();
  const { data: docs, loading, error } = useStarDocumentsInOrganization(organizationId);

  return (
    <DataRender
      loading={loading}
      loadingContent={() => (
        <List
          grid={grid}
          dataSource={[1, 2, 3]}
          renderItem={(doc) => (
            <List.Item style={{}}>
              <DocumentCardPlaceholder />
            </List.Item>
          )}
        />
      )}
      error={error}
      normalContent={() => (
        <List
          grid={grid}
          dataSource={docs}
          renderItem={(doc) => (
            <List.Item style={{}}>
              <DocumentCard document={doc} />
            </List.Item>
          )}
          emptyContent={<Empty message={'收藏的文档会出现在此处'} />}
        />
      )}
    />
  );
};

const StarWikis = () => {
  const { organizationId } = useRouterQuery<{ organizationId: string }>();
  const { data, loading, error } = useStarWikisInOrganization(organizationId);

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
          emptyContent={<Empty message={'收藏的知识库会出现在此处'} />}
        />
      )}
    />
  );
};

const Page: NextPage = () => {
  return (
    <AppSingleColumnLayout>
      <Seo title="主页" />
      <div className="container">
        <div className={styles.titleWrap}>
          <Title heading={3} style={{ margin: '8px 0' }}>
            知识库
          </Title>
        </div>
        <StarWikis />

        <div className={styles.titleWrap}>
          <Title heading={3} style={{ margin: '8px 0' }}>
            文档
          </Title>
        </div>
        <StarDocs />
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
      url: StarApiDefinition.getStarDocumentsInOrganization.client(organizationId),
      action: (cookie) => getStarDocumentsInOrganization(organizationId, cookie),
    },
  ]);
  return props;
};

export default Page;
