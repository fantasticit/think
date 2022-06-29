import { IconSmallTriangleDown } from '@douyinfe/semi-icons';
import { Avatar, Button, Dropdown, Space, Typography } from '@douyinfe/semi-ui';
import { DataRender } from 'components/data-render';
import { LogoImage, LogoText } from 'components/logo';
import { useUserOrganizations } from 'data/organization';
import Link from 'next/link';
import Router from 'next/router';
import { useCallback } from 'react';

import styles from './index.module.scss';

const { Text, Paragraph } = Typography;

export const OrganizationPublicSwitcher = () => {
  const {
    data: userOrganizations,
    loading: userOrganizationsLoading,
    error: userOrganizationsError,
  } = useUserOrganizations();

  const gotoCreate = useCallback(() => {
    Router.push(`/app/org/create`);
  }, []);

  return (
    <span className={styles.nameWrap}>
      <Space>
        <LogoImage />
        <LogoText />
      </Space>
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
                      <Space>新建组织</Space>
                    </Text>
                  </Dropdown.Item>
                </Dropdown.Menu>
              );
            }}
          />
        }
      >
        <Button size="small" icon={<IconSmallTriangleDown />} style={{ marginLeft: 12 }} />
      </Dropdown>
    </span>
  );
};
