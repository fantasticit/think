import { Spin } from '@douyinfe/semi-ui';
import { usePeronalOrganization } from 'data/organization';
import { SingleColumnLayout } from 'layouts/single-column';
import Router from 'next/router';
import { useEffect } from 'react';

const Page = () => {
  const { data: organization } = usePeronalOrganization();

  useEffect(() => {
    if (!organization) return;

    Router.replace({
      pathname: `/app/org/[organizationId]`,
      query: { organizationId: organization.id },
    });
  }, [organization]);

  return (
    <SingleColumnLayout>
      <div className="container">
        <div
          style={{
            padding: '10vh',
            textAlign: 'center',
          }}
        >
          <Spin></Spin>
        </div>
      </div>
    </SingleColumnLayout>
  );
};

export default Page;
