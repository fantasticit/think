import { Layout as SemiLayout } from '@douyinfe/semi-ui';
import React from 'react';

import { RouterHeader } from '../router-header';
import styles from './index.module.scss';

const { Content } = SemiLayout;

const style = {
  padding: '16px 24px',
  backgroundColor: 'var(--semi-color-bg-0)',
};

export const SingleColumnLayout: React.FC = ({ children }) => {
  return (
    <SemiLayout className={styles.wrap}>
      <RouterHeader />
      <SemiLayout className={styles.contentWrap}>
        <Content style={style}>
          <div>{children}</div>
        </Content>
      </SemiLayout>
    </SemiLayout>
  );
};
