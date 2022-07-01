import { Typography } from '@douyinfe/semi-ui';
import { Avatar } from '@douyinfe/semi-ui';
import { DataRender } from 'components/data-render';
import { useOrganizationDetail } from 'data/organization';
import { useRouterQuery } from 'hooks/use-router-query';
import Link from 'next/link';

import styles from './index.module.scss';

const { Text } = Typography;

export const OrganizationImage = () => {
  const { organizationId } = useRouterQuery<{ organizationId: string }>();
  const { data, loading, error } = useOrganizationDetail(organizationId);

  return (
    <DataRender
      loading={loading}
      error={error}
      normalContent={() => {
        return (
          <Link
            href={{
              pathname: '/app/org/[organizationId]',
              query: {
                organizationId: data.id,
              },
            }}
          >
            <a style={{ width: 36, height: 36 }}>
              <Avatar alt="cute cat" size="small" src={data.logo} style={{ margin: 4 }} />
            </a>
          </Link>
        );
      }}
    />
  );
};

export const OrganizationText = () => {
  const { organizationId } = useRouterQuery<{ organizationId: string }>();
  const { data, loading, error } = useOrganizationDetail(organizationId);

  return (
    <DataRender
      loading={loading}
      error={error}
      normalContent={() => {
        return (
          <Link
            href={{
              pathname: '/app/org/[organizationId]',
              query: {
                organizationId: data.id,
              },
            }}
          >
            <a style={{ width: 36, height: 36 }}>
              <Text>{data.name}</Text>
            </a>
          </Link>
        );
      }}
    />
  );
};
