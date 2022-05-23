import { List, Typography } from '@douyinfe/semi-ui';
import { CollectorApiDefinition } from '@think/domains';
import { DataRender } from 'components/data-render';
import { DocumentCard, DocumentCardPlaceholder } from 'components/document/card';
import { Empty } from 'components/empty';
import { Seo } from 'components/seo';
import { WikiCard, WikiCardPlaceholder } from 'components/wiki/card';
import {
  getCollectedDocuments,
  getCollectedWikis,
  useCollectedDocuments,
  useCollectedWikis,
} from 'data/refactor/collector';
import { SingleColumnLayout } from 'layouts/single-column';
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
  const { data: docs, loading, error } = useCollectedDocuments();

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
  const { data, loading, error } = useCollectedWikis();

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
    <SingleColumnLayout>
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
    </SingleColumnLayout>
  );
};

Page.getInitialProps = async (ctx) => {
  const props = await serverPrefetcher(ctx, [
    { url: CollectorApiDefinition.wikis.client(), action: (cookie) => getCollectedWikis(cookie) },
    { url: CollectorApiDefinition.documents.client(), action: (cookie) => getCollectedDocuments(cookie) },
  ]);
  return props;
};

export default Page;
