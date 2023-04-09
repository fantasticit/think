import React, { useCallback } from 'react';

import { Button, Layout as SemiLayout, Nav, Space } from '@douyinfe/semi-ui';

import { Message } from 'components/message';
import { OrganizationPublicSwitcher } from 'components/organization/public-switcher';
import { Theme } from 'components/theme';
import { User } from 'components/user';
import { useUser } from 'data/user';
import { IsOnMobile } from 'hooks/use-on-mobile';
import Router, { useRouter } from 'next/router';

const { Header: SemiHeader } = SemiLayout;

const menus = [
  {
    itemKey: '/',
    text: '主页',
    onClick: () => {
      Router.push({
        pathname: `/`,
      });
    },
  },
  {
    itemKey: '/find',
    text: '发现',
    onClick: () => {
      Router.push({
        pathname: `/find`,
      });
    },
  },
  {
    itemKey: '/template',
    text: '模板',
    onClick: () => {
      Router.push({
        pathname: `/template`,
      });
    },
  },
];

export const RouterHeader: React.FC = () => {
  const { user } = useUser();
  const { pathname } = useRouter();
  const { isMobile } = IsOnMobile.useHook();

  const gotoApp = useCallback(() => {
    Router.push(`/app`);
  }, []);

  return (
    <SemiHeader>
      {isMobile ? (
        <Nav
          mode="horizontal"
          style={{ overflow: 'auto' }}
          header={
            <Space>
              <OrganizationPublicSwitcher />
            </Space>
          }
          footer={
            <Space>
              {user && (
                <Button theme="solid" onClick={gotoApp}>
                  前往组织空间
                </Button>
              )}
              <Theme />
              <User />
            </Space>
          }
        ></Nav>
      ) : (
        <Nav
          mode="horizontal"
          style={{ overflow: 'auto' }}
          header={
            <Space style={{ marginRight: 12 }}>
              <OrganizationPublicSwitcher />
            </Space>
          }
          selectedKeys={[pathname || '/']}
          items={menus}
          footer={
            <Space>
              {user && (
                <Button theme="solid" onClick={gotoApp}>
                  前往组织空间
                </Button>
              )}
              {user && <Message />}
              <Theme />
              <User />
            </Space>
          }
        ></Nav>
      )}
    </SemiHeader>
  );
};
