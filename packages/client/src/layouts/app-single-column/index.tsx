import { Layout as SemiLayout } from '@douyinfe/semi-ui';
import React from 'react';

import { AppRouterHeader } from '../app-router-header';
import styles from './index.module.scss';

const { Content } = SemiLayout;

export const AppSingleColumnLayout: React.FC = ({ children }) => {
  return (
    <SemiLayout className={styles.wrap}>
      <AppRouterHeader />
      <SemiLayout className={styles.contentWrap}>
        <Content
          style={{
            padding: '16px 24px',
            backgroundColor: 'var(--semi-color-bg-0)',
          }}
        >
          <div>{children}</div>
        </Content>
      </SemiLayout>
    </SemiLayout>
  );
};
