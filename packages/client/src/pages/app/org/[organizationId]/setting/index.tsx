import { IOrganization } from '@think/domains';
import { OrganizationSetting } from 'components/organization/setting';
import { AppSingleColumnLayout } from 'layouts/app-single-column';
import { NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useCallback } from 'react';

interface IProps {
  organizationId: IOrganization['id'];
}

const Page: NextPage<IProps> = ({ organizationId }) => {
  const { query = {} } = useRouter();
  const { tab = 'base' } = query as {
    tab?: string;
  };

  const navigate = useCallback(
    (tab = 'base') => {
      console.log(tab);
      Router.push({
        pathname: `/app/org/[organizationId]/setting`,
        query: { organizationId, tab },
      });
    },
    [organizationId]
  );

  return (
    <AppSingleColumnLayout>
      <div className="container" style={{ padding: '16px 24px' }}>
        <OrganizationSetting organizationId={organizationId} tab={tab} onNavigate={navigate} />
      </div>
    </AppSingleColumnLayout>
  );
};

Page.getInitialProps = async (ctx) => {
  const { organizationId } = ctx.query;
  return { organizationId } as IProps;
};

export default Page;
