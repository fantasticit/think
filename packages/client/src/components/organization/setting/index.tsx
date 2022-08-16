import { TabPane, Tabs } from '@douyinfe/semi-ui';
import { IOrganization } from '@think/domains';
import { Seo } from 'components/seo';
import React from 'react';

import { Base } from './base';
import { OrganizationMembers } from './members';
import { More } from './more';

interface IProps {
  organizationId: IOrganization['id'];
  tab?: string;
  onNavigate: (arg: string) => void;
}

const TitleMap = {
  base: '基础信息',
  members: '成员管理',
  more: '更多',
};

export const OrganizationSetting: React.FC<IProps> = ({ organizationId, tab, onNavigate }) => {
  return (
    <>
      <Seo title={TitleMap[tab]} />
      <Tabs lazyRender type="line" activeKey={tab} onChange={onNavigate}>
        <TabPane tab={TitleMap['base']} itemKey="base">
          <Base organizationId={organizationId} />
        </TabPane>

        <TabPane tab={TitleMap['members']} itemKey="members">
          <OrganizationMembers organizationId={organizationId} />
        </TabPane>

        <TabPane tab={TitleMap['more']} itemKey="more">
          <More organizationId={organizationId} />
        </TabPane>
      </Tabs>
    </>
  );
};
