import { List, Pagination, Typography } from '@douyinfe/semi-ui';
import { WikiApiDefinition } from '@think/domains';
import { DataRender } from 'components/data-render';
import { Empty } from 'components/empty';
import { Seo } from 'components/seo';
import { WikiCard, WikiCardPlaceholder } from 'components/wiki/card';
import { getAllPublicWikis, useAllPublicWikis } from 'data/wiki';
import { SingleColumnLayout } from 'layouts/single-column';
import type { NextPage } from 'next';
import React from 'react';
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
const PAGESIZE = 12;

const Page: NextPage = () => {
  const { data, loading, error, page, setPage } = useAllPublicWikis();

  return (
    <SingleColumnLayout>
      <Seo title="发现" />
      <div className="container">
        <div style={{ marginBottom: 24 }}>
          <Title heading={3} style={{ margin: '8px 0' }}>
            发现
          </Title>
        </div>
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
            <>
              <List
                grid={grid}
                dataSource={data.data}
                renderItem={(wiki) => (
                  <List.Item>
                    <WikiCard wiki={wiki} shareMode />
                  </List.Item>
                )}
                emptyContent={<Empty message={'暂无数据'} />}
              />
              {data.total > PAGESIZE && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Pagination total={data.total} currentPage={page} pageSize={PAGESIZE} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        />
      </div>
    </SingleColumnLayout>
  );
};

Page.getInitialProps = async (ctx) => {
  const props = await serverPrefetcher(ctx, [
    { url: [WikiApiDefinition.getPublicWikis.client(), 1], action: (cookie) => getAllPublicWikis(1, cookie) },
  ]);
  return props;
};

export default Page;
