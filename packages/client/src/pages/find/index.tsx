import type { NextPage } from 'next';
import React from 'react';
import { List, Pagination, Typography } from '@douyinfe/semi-ui';
import { SingleColumnLayout } from 'layouts/single-column';
import { useAllPublicWikis } from 'data/wiki';
import { Empty } from 'components/empty';
import { Seo } from 'components/seo';
import { DataRender } from 'components/data-render';
import { WikiCardPlaceholder, WikiCard } from 'components/wiki/card';

const grid = {
  gutter: 16,
  xs: 24,
  sm: 12,
  md: 12,
  lg: 8,
  xl: 8,
};

const { Title } = Typography;

const Page: NextPage = () => {
  const { data, loading, error, setPage } = useAllPublicWikis();

  console.log(data);

  return (
    <SingleColumnLayout>
      <Seo title="发现" />
      <div className="container">
        <Title heading={3} style={{ marginBottom: 24 }}>
          发现
        </Title>
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
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination total={data.total} pageSize={12} onPageChange={setPage} />
              </div>
            </>
          )}
        />
      </div>
    </SingleColumnLayout>
  );
};

export default Page;
