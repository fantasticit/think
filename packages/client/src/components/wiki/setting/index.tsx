import { TabPane, Tabs } from '@douyinfe/semi-ui';
import { IWiki } from '@think/domains';
import { Seo } from 'components/seo';
import { WikiTocsManager } from 'components/wiki/tocs/manager';
import { useWikiDetail } from 'data/wiki';
import React from 'react';

import { Base } from './base';
import { Import } from './import';
import { More } from './more';
import { Privacy } from './privacy';
import { Users } from './users';

interface IProps {
  wikiId: IWiki['id'];
  tab?: string;
  onNavigate: (arg: string) => void;
}

const TitleMap = {
  base: '基础信息',
  privacy: '隐私管理',
  tocs: '目录管理',
  share: '隐私管理',
  documents: '全部文档',
  users: '成员管理',
  import: '导入文档',
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

        <TabPane tab={TitleMap['tocs']} itemKey="tocs">
          <WikiTocsManager wikiId={wikiId} />
        </TabPane>

        <TabPane tab={TitleMap['privacy']} itemKey="privacy">
          <Privacy wikiId={wikiId} />
        </TabPane>

        <TabPane tab={TitleMap['import']} itemKey="import">
          <Import wikiId={wikiId} />
        </TabPane>

        <TabPane tab={TitleMap['more']} itemKey="more">
          <More wikiId={wikiId} />
        </TabPane>
      </Tabs>
    </>
  );
};
