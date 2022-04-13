import React from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';
import { Seo } from 'components/seo';
import { useWikiDetail } from 'data/wiki';
import { Base } from './base';
import { Users } from './users';
import { Documents } from './documents';
import { More } from './more';

interface IProps {
  wikiId: string;
  tab?: string;
  onNavigate: (arg: string) => void;
}

const TitleMap = {
  base: '基础信息',
  users: '成员管理',
  docs: '隐私管理',
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
        <TabPane tab={TitleMap['docs']} itemKey="docs">
          <Documents wikiId={wikiId} />
        </TabPane>
        <TabPane tab={TitleMap['more']} itemKey="more">
          <More wikiId={wikiId} />
        </TabPane>
      </Tabs>
    </>
  );
};
