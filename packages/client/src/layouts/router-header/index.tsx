import { Layout as SemiLayout, Nav, Space } from '@douyinfe/semi-ui';
import { Message } from 'components/message';
import { OrganizationPublicSwitcher } from 'components/organization/public-switcher';
import { Theme } from 'components/theme';
import { User } from 'components/user';
import { IsOnMobile } from 'hooks/use-on-mobile';
import Router, { useRouter } from 'next/router';
import React from 'react';

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
];

export const RouterHeader: React.FC = () => {
  const { pathname } = useRouter();
  const { isMobile } = IsOnMobile.useHook();

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
              <Message />
              <Theme />
              <User />
            </Space>
          }
        ></Nav>
      )}
    </SemiHeader>
  );
};
