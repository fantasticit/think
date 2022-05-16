import { IconMenu } from '@douyinfe/semi-icons';
import { Button, Dropdown, Layout as SemiLayout, Nav, Space, Typography } from '@douyinfe/semi-ui';
import { LogoImage, LogoText } from 'components/logo';
import { Message } from 'components/message';
import { Search } from 'components/search';
import { Theme } from 'components/theme';
import { User } from 'components/user';
import { WikiOrDocumentCreator } from 'components/wiki-or-document-creator';
import { useToggle } from 'hooks/use-toggle';
import { useWindowSize } from 'hooks/use-window-size';
import Router, { useRouter } from 'next/router';
import React from 'react';

import styles from './index.module.scss';
import { Recent, RecentModal } from './recent';
import { Wiki, WikiModal } from './wiki';

const { Header: SemiHeader } = SemiLayout;
const { Text } = Typography;

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
    itemKey: '/recent',
    text: <Recent />,
  },
  {
    itemKey: '/wiki',
    text: <Wiki />,
  },
  {
    itemKey: '/star',
    text: '收藏',
    onClick: () => {
      Router.push({
        pathname: `/star`,
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
  const { width, isMobile } = useWindowSize();
  const [dropdownVisible, toggleDropdownVisible] = useToggle(false);
  const [recentModalVisible, toggleRecentModalVisible] = useToggle(false);
  const [wikiModalVisible, toggleWikiModalVisible] = useToggle(false);

  return (
    <SemiHeader>
      {isMobile ? (
        <div className={styles.mobileHeader}>
          <Space>
            <LogoImage />
            <LogoText />
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

          <Space>
            <WikiOrDocumentCreator />
            <Search />
            <Message />
            <Theme />
            <User />
          </Space>
        </div>
      ) : (
        <Nav
          mode="horizontal"
          style={{ overflow: 'auto' }}
          header={
            <Space>
              <LogoImage />
              {width >= 890 && <LogoText />}
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
