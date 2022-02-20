import React from "react";
import { Tabs, TabPane } from "@douyinfe/semi-ui";
import { useWikiDetail } from "data/wiki";
import { Base } from "./base";
import { Users } from "./users";
import { WorkspaceDocs } from "./documents";
import { More } from "./more";

interface IProps {
  wikiId: string;
  tab?: string;
  onNavigate: (arg: string) => void;
}

export const WikiSetting: React.FC<IProps> = ({ wikiId, tab, onNavigate }) => {
  const { data, loading, error, update } = useWikiDetail(wikiId);

  return (
    <Tabs lazyRender type="line" activeKey={tab} onChange={onNavigate}>
      <TabPane tab="基础信息" itemKey="base">
        <Base wiki={data} update={update as any} />
      </TabPane>
      <TabPane tab="成员管理" itemKey="users">
        <Users wikiId={wikiId} />
      </TabPane>
      <TabPane tab="隐私管理" itemKey="docs">
        <WorkspaceDocs wikiId={wikiId} />
      </TabPane>
      <TabPane tab="更多" itemKey="more">
        <More wikiId={wikiId} />
      </TabPane>
    </Tabs>
  );
};
