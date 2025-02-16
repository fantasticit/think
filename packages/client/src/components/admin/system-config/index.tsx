import React from 'react';

import { TabPane, Tabs } from '@douyinfe/semi-ui';

import { Ad } from './ad';
import { Mail } from './mail';
import { System } from './system';

interface IProps {
  tab?: string;
  onNavigate: (arg: string) => void;
}

const TitleMap = {
  base: '系统管理',
  mail: '邮箱服务',
  ad: '广告管理',
};

export const SystemConfig: React.FC<IProps> = ({ tab, onNavigate }) => {
  return (
    <Tabs lazyRender type="line" activeKey={tab} onChange={onNavigate}>
      <TabPane tab={TitleMap['base']} itemKey="base">
        <System />
      </TabPane>

      <TabPane tab={TitleMap['mail']} itemKey="mail">
        <Mail />
      </TabPane>

      <TabPane tab={TitleMap['ad']} itemKey="ad">
        <Ad />
      </TabPane>
    </Tabs>
  );
};
