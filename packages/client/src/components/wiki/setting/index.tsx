import { TabPane, Tabs } from '@douyinfe/semi-ui';
import { Seo } from 'components/seo';
import { useWikiDetail } from 'data/wiki';
import React from 'react';

import { Base } from './base';
import { More } from './more';
import { Privacy } from './privacy';
import { Users } from './users';

interface IProps {
  wikiId: string;
  tab?: string;
  onNavigate: (arg: string) => void;
}

const TitleMap = {
  base: '基础信息',
  privacy: '隐私管理',
  users: '成员管理',
  more: '更多',
};

export const WikiSetting: React.FC<IProps> = ({ wikiId, tab, onNavigate }) => {
  const { data, update } = useWikiDetail(wikiId);

  return (
    <>
      <Seo title={TitleMap[tab]} />
      <Tabs lazyRender type="line" activeKey={tab} onChange={onNavigate}>
        <TabPane tab={TitleMap['base']} itemKey="base">
          <Base wiki={data} update={update as any} />
        </TabPane>
        <TabPane tab={TitleMap['users']} itemKey="users">
          <Users wikiId={wikiId} />
        </TabPane>
        <TabPane tab={TitleMap['privacy']} itemKey="privacy">
          <Privacy wikiId={wikiId} />
        </TabPane>
        <TabPane tab={TitleMap['more']} itemKey="more">
          <More wikiId={wikiId} />
        </TabPane>
      </Tabs>
    </>
  );
};
