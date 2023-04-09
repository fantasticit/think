import React from 'react';

import { IOrganization } from '@think/domains';

import { Members } from 'components/members';
import { useOrganizationMembers } from 'data/organization';

interface IProps {
  organizationId: IOrganization['id'];
}

export const OrganizationMembers: React.FC<IProps> = ({ organizationId }) => {
  return <Members id={organizationId} hook={useOrganizationMembers} />;
};
