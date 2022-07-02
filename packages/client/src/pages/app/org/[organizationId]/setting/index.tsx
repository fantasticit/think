import { Typography } from '@douyinfe/semi-ui';
import { IOrganization } from '@think/domains';
import { OrganizationSetting } from 'components/organization/setting';
import { AppSingleColumnLayout } from 'layouts/app-single-column';
import { NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useCallback } from 'react';

interface IProps {
  organizationId: IOrganization['id'];
}

const { Title } = Typography;

const Page: NextPage<IProps> = ({ organizationId }) => {
  const { query = {} } = useRouter();
  const { tab = 'base' } = query as {
    tab?: string;
  };

  const navigate = useCallback(
    (tab = 'base') => {
      Router.push({
        pathname: `/app/org/[organizationId]/setting`,
        query: { organizationId, tab },
      });
    },
    [organizationId]
  );

  return (
    <AppSingleColumnLayout>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title heading={3} style={{ margin: '8px 0' }}>
            组织设置
          </Title>
        </div>
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
