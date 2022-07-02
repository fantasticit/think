import { Avatar, Button, Table, Typography } from '@douyinfe/semi-ui';
import { IOrganization } from '@think/domains';
import { DataRender } from 'components/data-render';
import { LocaleTime } from 'components/locale-time';
import { Seo } from 'components/seo';
import { usePeronalOrganization, useUserOrganizations } from 'data/organization';
import { SingleColumnLayout } from 'layouts/single-column';
import Link from 'next/link';
import Router from 'next/router';
import { useCallback, useEffect } from 'react';

const { Title, Paragraph } = Typography;
const { Column } = Table;

const Page = () => {
  const { data: organization } = usePeronalOrganization();
  const {
    data: userOrganizations,
    loading: userOrganizationsLoading,
    error: userOrganizationsError,
  } = useUserOrganizations();

  const gotoCreate = useCallback(() => {
    Router.push({
      pathname: '/app/org/create',
    });
  }, []);

  useEffect(() => {
    if (userOrganizations && userOrganizations.length) return;
    if (!organization) return;

    Router.replace({
      pathname: `/app/org/[organizationId]`,
      query: { organizationId: organization.id },
    });
  }, [organization, userOrganizations]);

  return (
    <SingleColumnLayout>
      <Seo title="组织列表" />
      <div className="container">
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title heading={3} style={{ margin: '8px 0' }}>
            组织列表
          </Title>
          <Button onClick={gotoCreate}>新建组织</Button>
        </div>
        <DataRender
          loading={userOrganizationsLoading}
          error={userOrganizationsError}
          normalContent={() => (
            <>
              <Table style={{ margin: '16px 0' }} dataSource={userOrganizations} size="small" pagination={false}>
                <Column
                  title="名称"
                  dataIndex="name"
                  key="name"
                  width={200}
                  render={(_, org: IOrganization) => {
                    return (
                      <Link
                        href={{
                          pathname: `/app/org/[organizationId]`,
                          query: {
                            organizationId: org.id,
                          },
                        }}
                      >
                        <a style={{ color: 'inherit', textDecoration: 'none' }}>
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar size="small" src={org.logo} style={{ marginRight: 8 }} />
                            <Paragraph
                              style={{
                                maxWidth: 100,
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                              }}
                              strong
                            >
                              {org.name}
                            </Paragraph>
                          </span>
                        </a>
                      </Link>
                    );
                  }}
                />
                <Column
                  width={120}
                  title="创建时间"
                  dataIndex="createdAt"
                  key="createdAt"
                  render={(date) => <LocaleTime date={date} />}
                />
              </Table>
            </>
          )}
        />
      </div>
    </SingleColumnLayout>
  );
};

export default Page;
