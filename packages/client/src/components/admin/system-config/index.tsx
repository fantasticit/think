import { TabPane, Tabs } from '@douyinfe/semi-ui';
import React from 'react';

import { Mail } from './mail';
import { System } from './system';

interface IProps {
  tab?: string;
  onNavigate: (arg: string) => void;
}

const TitleMap = {
  base: '系统管理',
  mail: '邮箱服务',
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
    </Tabs>
  );
};
