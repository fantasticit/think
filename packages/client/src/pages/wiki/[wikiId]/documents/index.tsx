import { NextPage } from "next";
import Router, { useRouter } from "next/router";
import React, { useCallback } from "react";
import { Typography, List, Tabs, TabPane, Tree } from "@douyinfe/semi-ui";
import { CreateDocumentIllustration } from "illustrations/create-document";
import { DoubleColumnLayout } from "layouts/double-column";
import { DataRender } from "components/data-render";
import { WikiTocs } from "components/wiki/tocs";
import { WikiTocsManager } from "components/wiki/tocs/manager";
import { useWikiDocs } from "data/wiki";
import {
  DocumentCardPlaceholder,
  DocumentCard,
} from "components/document/card";
import { Empty } from "components/empty";
import { DocumentCreator } from "components/document-creator";

interface IProps {
  wikiId: string;
}

const { Title } = Typography;

const grid = {
  gutter: 16,
  xs: 24,
  sm: 12,
  md: 12,
  lg: 8,
  xl: 8,
  xxl: 6,
};

const AllDocs = ({ wikiId }) => {
  const { data: docs, loading, error } = useWikiDocs(wikiId);
  return (
    <DataRender
      loading={loading}
      loadingContent={() => (
        <List
          grid={grid}
          dataSource={Array.from({ length: 9 })}
          renderItem={() => (
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
          emptyContent={
            <Empty
              illustration={<CreateDocumentIllustration />}
              message={<DocumentCreator />}
            />
          }
        />
      )}
    />
  );
};

const Page: NextPage<IProps> = ({ wikiId }) => {
  const { query = {} } = useRouter();
  const { tab = "documents" } = query as {
    tab?: string;
  };

  const navigate = useCallback(
    (tab) => {
      Router.push({
        pathname: `/wiki/${wikiId}/documents`,
        query: { tab },
      });
    },
    [wikiId]
  );

  return (
    <DoubleColumnLayout
      leftNode={<WikiTocs pageTitle="文档管理" wikiId={wikiId} />}
      rightNode={
        <>
          <Title heading={3} style={{ marginBottom: 24 }}>
            文档管理
          </Title>
          <Tabs type="button" activeKey={tab} onChange={(tab) => navigate(tab)}>
            <TabPane tab="全部文档" itemKey="documents">
              <AllDocs wikiId={wikiId} />
            </TabPane>
            <TabPane tab="目录管理" itemKey="tocs">
              <WikiTocsManager wikiId={wikiId} />
            </TabPane>
          </Tabs>
        </>
      }
    ></DoubleColumnLayout>
  );
};

Page.getInitialProps = async (ctx) => {
  const { wikiId } = ctx.query;
  return { wikiId } as IProps;
};

export default Page;
