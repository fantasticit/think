import React, { useMemo } from 'react';

import { IconMenu } from '@douyinfe/semi-icons';
import { Button, Dropdown, Layout as SemiLayout, Nav, Space } from '@douyinfe/semi-ui';

import { Message } from 'components/message';
import { OrganizationSwitcher } from 'components/organization/switcher';
import { Search } from 'components/search';
import { Theme } from 'components/theme';
import { User } from 'components/user';
import { WikiOrDocumentCreator } from 'components/wiki-or-document-creator';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { useRouterQuery } from 'hooks/use-router-query';
import { useToggle } from 'hooks/use-toggle';
import Router, { useRouter } from 'next/router';

import { Recent, RecentModal } from './recent';
import { Wiki, WikiModal } from './wiki';

const { Header: SemiHeader } = SemiLayout;

export const AppRouterHeader: React.FC = () => {
  const { organizationId } = useRouterQuery<{ organizationId: string }>();
  const { pathname } = useRouter();
  const { isMobile } = IsOnMobile.useHook();
  const [dropdownVisible, toggleDropdownVisible] = useToggle(false);
  const [recentModalVisible, toggleRecentModalVisible] = useToggle(false);
  const [wikiModalVisible, toggleWikiModalVisible] = useToggle(false);

  const menus = useMemo(
    () => [
      {
        itemKey: '/app/org/[organizationId]',
        text: '主页',
        onClick: () => {
          Router.push({
            pathname: `/app/org/${organizationId}`,
          });
        },
      },
      {
        itemKey: 'recent',
        text: <Recent />,
      },
      {
        itemKey: '/app/org/[organizationId]/wiki',
        text: <Wiki />,
      },
      {
        itemKey: '/app/org/[organizationId]/star',
        text: '星标',
        onClick: () => {
          Router.push({
            pathname: `/app/org/${organizationId}/star`,
          });
        },
      },
      {
        itemKey: '/app/org/[organizationId]/setting',
        text: '设置',
        onClick: () => {
          Router.push({
            pathname: `/app/org/${organizationId}/setting`,
          });
        },
      },
    ],
    [organizationId]
  );

  return (
    <SemiHeader>
      {isMobile ? (
        <Nav
          mode="horizontal"
          style={{ overflow: 'auto' }}
          header={
            <Space>
              <OrganizationSwitcher key={organizationId} />
              <RecentModal visible={recentModalVisible} toggleVisible={toggleRecentModalVisible} />
              <WikiModal visible={wikiModalVisible} toggleVisible={toggleWikiModalVisible} />
              <Dropdown
                trigger="click"
                position="bottomRight"
                visible={dropdownVisible}
                onVisibleChange={toggleDropdownVisible}
                render={
                  // @ts-ignore
                  <Dropdown.Menu onClick={toggleDropdownVisible}>
                    {menus.slice(0, 1).map((menu) => {
                      return (
                        <Dropdown.Item key={menu.itemKey} onClick={menu.onClick}>
                          {menu.text}
                        </Dropdown.Item>
                      );
                    })}
                    <Dropdown.Item onClick={toggleRecentModalVisible}>最近</Dropdown.Item>
                    <Dropdown.Item onClick={toggleWikiModalVisible}>知识库</Dropdown.Item>
                    {menus.slice(3).map((menu) => {
                      return (
                        <Dropdown.Item key={menu.itemKey} onClick={menu.onClick}>
                          {menu.text}
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown.Menu>
                }
              >
                <Button icon={<IconMenu />} type="tertiary" theme="borderless" onMouseDown={toggleDropdownVisible} />
              </Dropdown>
            </Space>
          }
          footer={
            <Space>
              <WikiOrDocumentCreator />
              <Search />
              <Message />
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
              <OrganizationSwitcher key={organizationId} />
            </Space>
          }
          selectedKeys={[pathname || '/']}
          items={menus}
          footer={
            <Space>
              <WikiOrDocumentCreator />
              <Search />
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
