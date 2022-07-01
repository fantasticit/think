import { Members } from 'components/members';
import { useWikiMembers } from 'data/wiki';
import React from 'react';

interface IProps {
  wikiId: string;
}

export const Users: React.FC<IProps> = ({ wikiId }) => {
  return (
    <Members
      id={wikiId}
      hook={useWikiMembers}
      descriptions={['权限继承：默认继承组织成员权限', '超级管理员：组织超级管理员和知识库创建者']}
    />
  );
};
