import { IOrganization } from '@think/domains';
import { Members } from 'components/members';
import { useOrganizationMembers } from 'data/organization';
import React from 'react';

interface IProps {
  organizationId: IOrganization['id'];
}

export const OrganizationMembers: React.FC<IProps> = ({ organizationId }) => {
  return <Members id={organizationId} hook={useOrganizationMembers} />;
};
