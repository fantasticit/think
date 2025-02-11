import React, { useCallback } from 'react';

import { Button, Typography } from '@douyinfe/semi-ui';

import { Seo } from 'components/seo';
import { toLogin, useUser } from 'data/user';
import { RuntimeConfig } from 'hooks/use-runtime-config';
import { TeamWorkIllustration } from 'illustrations/team-work';
import { SingleColumnLayout } from 'layouts/single-column';
import type { NextPage } from 'next';
import Router from 'next/router';

import styles from './index.module.scss';

const { Title, Paragraph } = Typography;

const Page: NextPage = () => {
  const config = RuntimeConfig.useHook();

  const { user } = useUser();

  const start = useCallback(() => {
    if (user) {
      Router.push(`/app`);
    } else {
      toLogin();
    }
  }, [user]);

  const toExternal = useCallback(() => {
    window.open(config.externalButtonURL);
  }, [config.externalButtonURL]);

  return (
    <SingleColumnLayout>
      <Seo title="主页" />
      <div className="container">
        <div className={styles.wrap}>
          <div className={styles.content}>
            <div>
              <div>
                <Title style={{ marginBottom: 12 }}>{config?.appName}</Title>
                <Paragraph type="tertiary">{config?.appDescription}</Paragraph>
              </div>
              <div style={{ margin: '32px 0' }}>
                <Button theme="solid" onClick={start}>
                  开始使用
                </Button>
                {config.externalButtonText && (
                  <Button style={{ marginLeft: 12 }} onClick={toExternal}>
                    {config.externalButtonText}
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className={styles.hero}>
            <TeamWorkIllustration />
          </div>
        </div>
      </div>
    </SingleColumnLayout>
  );
};

export default Page;
