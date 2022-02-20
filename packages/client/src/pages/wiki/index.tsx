import type { NextPage } from "next";
import React from "react";
import { Typography, Tabs, TabPane, List } from "@douyinfe/semi-ui";
import { SingleColumnLayout } from "layouts/single-column";
import { useAllWikis, useOwnWikis, useJoinWikis } from "data/wiki";
import { CreateWikiIllustration } from "illustrations/create-wiki";
import { Empty } from "components/empty";
import { Seo } from "components/seo";
import { DataRender } from "components/data-render";
import { WikiCardPlaceholder, WikiCard } from "components/wiki/card";
import { WikiCreator } from "components/wiki-creator";

const grid = {
  gutter: 16,
  xs: 24,
  sm: 12,
  md: 12,
  lg: 8,
  xl: 8,
};

const { Title } = Typography;

const Workspaces = ({ hook }) => {
  const { data, loading, error } = hook();

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
          emptyContent={
            <Empty
              illustration={<CreateWikiIllustration />}
              message={<WikiCreator />}
            />
          }
        />
      )}
    />
  );
};

const Page: NextPage = () => {
  return (
    <SingleColumnLayout>
      <Seo title="知识库" />
      <div className="container">
        <Title heading={3}>知识库</Title>
        <Tabs type="button" style={{ marginTop: 24 }}>
          <TabPane tab="全部" itemKey="all">
            <Workspaces hook={useAllWikis} />
          </TabPane>
          <TabPane tab="我创建的" itemKey="own">
            <Workspaces hook={useOwnWikis} />
          </TabPane>
          <TabPane tab="我参与的" itemKey="join">
            <Workspaces hook={useJoinWikis} />
          </TabPane>
        </Tabs>
      </div>
    </SingleColumnLayout>
  );
};

export default Page;
