import React from 'react';
import { Layout as SemiLayout, Nav, Space, Typography, Dropdown, Button } from '@douyinfe/semi-ui';
import { IconMenu } from '@douyinfe/semi-icons';
import Router, { useRouter } from 'next/router';
import { User } from 'components/user';
import { WikiOrDocumentCreator } from 'components/wiki-or-document-creator';
import { LogoImage, LogoText } from 'components/logo';
import { Theme } from 'components/theme';
import { Message } from 'components/message';
import { Search } from 'components/search';
import { useWindowSize } from 'hooks/use-window-size';
import { useToggle } from 'hooks/use-toggle';
import { Recent, RecentModal } from './recent';
import { Wiki, WikiModal } from './wiki';
import styles from './index.module.scss';

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
              render={
                <Dropdown.Menu>
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
              <Button icon={<IconMenu />} type="tertiary" theme="borderless" />
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
