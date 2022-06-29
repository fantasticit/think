import { IconAppCenter, IconSmallTriangleDown } from '@douyinfe/semi-icons';
import { Button, Dropdown, Space, Typography } from '@douyinfe/semi-ui';
import { Avatar } from '@douyinfe/semi-ui';
import { DataRender } from 'components/data-render';
import { useOrganizationDetail, useUserOrganizations } from 'data/organization';
import { useRouterQuery } from 'hooks/use-router-query';
import Link from 'next/link';
import Router from 'next/router';
import { useCallback } from 'react';

import styles from './index.module.scss';

const { Text, Paragraph } = Typography;

export const OrganizationSwitcher = () => {
  const { organizationId } = useRouterQuery<{ organizationId: string }>();
  const { data, loading, error } = useOrganizationDetail(organizationId);

  const {
    data: userOrganizations,
    loading: userOrganizationsLoading,
    error: userOrganizationsError,
  } = useUserOrganizations();

  const gotoCreate = useCallback(() => {
    Router.push(`/app/org/create`);
  }, []);

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
              <Dropdown
                trigger="click"
                render={
                  <DataRender
                    loading={userOrganizationsLoading}
                    error={userOrganizationsError}
                    normalContent={() => {
                      return (
                        <Dropdown.Menu>
                          {(userOrganizations || []).map((org) => {
                            return (
                              <Dropdown.Item key={org.id}>
                                <Link
                                  href={{
                                    pathname: '/app/org/[organizationId]',
                                    query: {
                                      organizationId: org.id,
                                    },
                                  }}
                                >
                                  <a style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
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
                          <Dropdown.Item onClick={gotoCreate}>
                            <Text>
                              <Space>
                                <Avatar size="extra-small">
                                  <IconAppCenter />
                                </Avatar>
                                新建组织
                              </Space>
                            </Text>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      );
                    }}
                  />
                }
              >
                <Button
                  size="small"
                  icon={<IconSmallTriangleDown />}
                  style={{ marginLeft: 12 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                />
              </Dropdown>
            </a>
          </Link>
        );
      }}
    />
  );
};
