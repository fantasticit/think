import { IconAppCenter, IconApps, IconSmallTriangleDown } from '@douyinfe/semi-icons';
import { Button, Dropdown, Space, Typography } from '@douyinfe/semi-ui';
import { Avatar } from '@douyinfe/semi-ui';
import { DataRender } from 'components/data-render';
import { useOrganizationDetail, useUserOrganizations } from 'data/organization';
import { useRouterQuery } from 'hooks/use-router-query';
import Link from 'next/link';
import { useMemo } from 'react';

import styles from './index.module.scss';

const { Text, Paragraph } = Typography;

export const UserOrganizationsSwitcher = () => {
  const { organizationId } = useRouterQuery<{ organizationId: string }>();
  const {
    data: userOrganizations,
    loading: userOrganizationsLoading,
    error: userOrganizationsError,
  } = useUserOrganizations();
  const filterUserOrganizations = useMemo(() => {
    return userOrganizations && userOrganizations.length
      ? userOrganizations.filter((org) => org.id !== organizationId)
      : [];
  }, [userOrganizations, organizationId]);

  return (
    <Dropdown
      trigger="click"
      render={
        <DataRender
          loading={userOrganizationsLoading}
          error={userOrganizationsError}
          normalContent={() => {
            return (
              <Dropdown.Menu>
                {filterUserOrganizations.length ? (
                  <>
                    {filterUserOrganizations.map((org) => {
                      return (
                        <Dropdown.Item key={org.id} style={{ padding: 0 }}>
                          <Link
                            href={{
                              pathname: '/app/org/[organizationId]',
                              query: {
                                organizationId: org.id,
                              },
                            }}
                          >
                            <a style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '8px 16px' }}>
                              <Avatar size="extra-small" src={org.logo} style={{ marginRight: 8 }} />
                              <Paragraph
                                style={{
                                  maxWidth: 100,
                                  whiteSpace: 'nowrap',
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                }}
                              >
                                {org.name}
                              </Paragraph>
                            </a>
                          </Link>
                        </Dropdown.Item>
                      );
                    })}
                    <Dropdown.Divider />
                  </>
                ) : null}

                <Dropdown.Item style={{ padding: 0 }}>
                  <Link
                    href={{
                      pathname: '/',
                    }}
                  >
                    <a style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '8px 16px' }}>
                      <Text>
                        <Space>
                          <Avatar size="extra-small">
                            <IconApps />
                          </Avatar>
                          前往广场
                        </Space>
                      </Text>
                    </a>
                  </Link>
                </Dropdown.Item>

                <Dropdown.Item style={{ padding: 0 }}>
                  <Link
                    href={{
                      pathname: '/app/org/create',
                    }}
                  >
                    <a style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '8px 16px' }}>
                      <Text>
                        <Space>
                          <Avatar size="extra-small">
                            <IconAppCenter />
                          </Avatar>
                          新建组织
                        </Space>
                      </Text>
                    </a>
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            );
          }}
        />
      }
    >
      <Button size="small" icon={<IconSmallTriangleDown />} style={{ marginLeft: 12 }} />
    </Dropdown>
  );
};

export const OrganizationSwitcher = () => {
  const { organizationId } = useRouterQuery<{ organizationId: string }>();
  const { data, loading, error } = useOrganizationDetail(organizationId);

  return (
    <DataRender
      loading={loading}
      error={error}
      normalContent={() => {
        return (
          <>
            <Link
              href={{
                pathname: '/app/org/[organizationId]',
                query: {
                  organizationId: data.id,
                },
              }}
            >
              <a className={styles.nameWrap}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar size="small" src={data.logo} style={{ marginRight: 8 }} />
                  <Paragraph
                    style={{
                      maxWidth: 100,
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                    strong
                  >
                    {data.name}
                  </Paragraph>
                </span>
              </a>
            </Link>
            <UserOrganizationsSwitcher />
          </>
        );
      }}
    />
  );
};
