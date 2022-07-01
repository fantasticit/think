import { Banner, Typography } from '@douyinfe/semi-ui';
import { SystemConfig } from 'components/admin/system-config';
import { Seo } from 'components/seo';
import { useUser } from 'data/user';
import { Forbidden } from 'illustrations/forbidden';
import { SingleColumnLayout } from 'layouts/single-column';
import type { NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import styles from './index.module.scss';

const { Title, Text } = Typography;

const Page: NextPage = () => {
  const { user } = useUser();
  const { query = {} } = useRouter();
  const { tab = 'base' } = query as {
    tab?: string;
  };

  const navigate = useCallback((tab = 'base') => {
    Router.push({
      pathname: `/admin`,
      query: { tab },
    });
  }, []);

  return (
    <SingleColumnLayout>
      <Seo title="管理后台" key={tab} />
      <div className="container">
        {user && user.isSystemAdmin ? (
          <>
            <div className={styles.titleWrap}>
              <Title heading={3} style={{ margin: '8px 0' }}>
                管理后台
              </Title>
            </div>
            <Banner type="info" description="该部分是全局的系统管理后台，用于系统配置管理等操作！" />
            <SystemConfig tab={tab} onNavigate={navigate} />
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Forbidden />
            <Text strong type="danger">
              无权限查看
            </Text>
          </div>
        )}
      </div>
    </SingleColumnLayout>
  );
};

export default Page;
