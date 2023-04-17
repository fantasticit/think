import React, { useCallback } from 'react';

import { Button, TabPane, Tabs, Typography } from '@douyinfe/semi-ui';

import { Seo } from 'components/seo';
import { TemplateList } from 'components/template/list';
import { useOwnTemplates, usePublicTemplates } from 'data/template';
import { SingleColumnLayout } from 'layouts/single-column';
import type { NextPage } from 'next';
import Router, { useRouter } from 'next/router';

import styles from './index.module.scss';

const { Title } = Typography;
const PAGE_SIZE = 9;

const Page: NextPage = () => {
  const { addTemplate } = useOwnTemplates(PAGE_SIZE);
  const { query = {} } = useRouter();
  const { tab = 'public' } = query as {
    tab?: string;
  };

  const navigate = useCallback((tab = 'public') => {
    Router.push({
      pathname: `/template`,
      query: { tab },
    });
  }, []);

  const handleAdd = () => {
    addTemplate({ title: '未命名模板' }).then((res) => {
      Router.push(`/template/${res.id}`);
    });
  };

  return (
    <SingleColumnLayout>
      <Seo key={tab} title="模板" />
      <div className="container">
        <div className={styles.titleWrap}>
          <Title heading={3} style={{ margin: '8px 0' }}>
            模板
          </Title>
          <Button onClick={handleAdd}>新建模板</Button>
        </div>
        <Tabs type="button" style={{ marginTop: 16 }} activeKey={tab} onChange={(tab) => navigate(tab)}>
          <TabPane tab="公开模板" itemKey="public">
            <TemplateList hook={usePublicTemplates} pageSize={PAGE_SIZE} />
          </TabPane>
          <TabPane tab="我创建的" itemKey="own">
            <TemplateList hook={useOwnTemplates} pageSize={PAGE_SIZE} />
          </TabPane>
        </Tabs>
      </div>
    </SingleColumnLayout>
  );
};

export default Page;
