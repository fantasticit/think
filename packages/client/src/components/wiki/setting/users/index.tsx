import { Members } from 'components/members';
import { useWikiMembers } from 'data/wiki';
import React from 'react';

interface IProps {
  wikiId: string;
}

export const Users: React.FC<IProps> = ({ wikiId }) => {
  return <Members id={wikiId} hook={useWikiMembers} />;
};
