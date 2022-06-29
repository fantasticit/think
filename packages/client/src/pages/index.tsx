import { Button, Typography } from '@douyinfe/semi-ui';
import { Seo } from 'components/seo';
import { SingleColumnLayout } from 'layouts/single-column';
import type { NextPage } from 'next';
import Router from 'next/router';
import React, { useCallback } from 'react';

const { Title } = Typography;

const Page: NextPage = () => {
  const gotoApp = useCallback(() => {
    Router.push(`/app`);
  }, []);

  return (
    <SingleColumnLayout>
      <Seo title="主页" />
      <div className="container">
        <div style={{ marginBottom: 24 }}>
          <Title heading={3} style={{ margin: '8px 0' }}>
            主页
          </Title>
        </div>
        <div
          style={{
            padding: '10vh',
            textAlign: 'center',
          }}
        >
          <Button theme="solid" onClick={gotoApp}>
            前往组织空间
          </Button>
        </div>
      </div>
    </SingleColumnLayout>
  );
};

export default Page;
