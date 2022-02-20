import type { NextPage } from "next";
import Router, { useRouter } from "next/router";
import React, { useCallback } from "react";
import { Typography, Button, Tabs, TabPane } from "@douyinfe/semi-ui";
import { Seo } from "components/seo";
import { SingleColumnLayout } from "layouts/single-column";
import { usePublicTemplates, useOwnTemplates } from "data/template";
import { TemplateList } from "components/template/list";
import styles from "./index.module.scss";

const { Title } = Typography;

const Page: NextPage = () => {
  const { addTemplate } = useOwnTemplates();
  const { query = {} } = useRouter();
  const { tab = "public" } = query as {
    tab?: string;
  };

  const navigate = useCallback((tab = "public") => {
    Router.push({
      pathname: `/template`,
      query: { tab },
    });
  }, []);

  const handleAdd = () => {
    addTemplate({ title: "未命名模板" }).then((res) => {
      Router.push(`/template/${res.id}`);
    });
  };

  return (
    <SingleColumnLayout>
      <Seo title="模板" />
      <div className="container">
        <div className={styles.titleWrap}>
          <Title heading={3} style={{ margin: "8px 0" }}>
            快捷访问
          </Title>
          <Button onClick={handleAdd}>新建模板</Button>
        </div>
        <Tabs
          type="button"
          style={{ marginTop: 16 }}
          activeKey={tab}
          onChange={(tab) => navigate(tab)}
        >
          <TabPane tab="公开模板" itemKey="public">
            <TemplateList hook={usePublicTemplates} pageSize={9} />
          </TabPane>
          <TabPane tab="我创建的" itemKey="own">
            <TemplateList hook={useOwnTemplates} pageSize={9} />
          </TabPane>
        </Tabs>
      </div>
    </SingleColumnLayout>
  );
};

export default Page;
