import { IconDelete, IconEdit } from '@douyinfe/semi-icons';
import { Banner, Button, Popconfirm, Table, Typography } from '@douyinfe/semi-ui';
import { AuthEnumTextMap } from '@think/domains';
import { DataRender } from 'components/data-render';
import { LocaleTime } from 'components/locale-time';
import React from 'react';

import { AddUser } from './add';
import { EditUser } from './edit';
import styles from './index.module.scss';

interface IProps {
  id: string;
  hook: any;
  descriptions?: Array<string>;
}

const { Title, Paragraph } = Typography;
const { Column } = Table;

export const Members: React.FC<IProps> = ({ id, hook, descriptions }) => {
  const { data, loading, error, page, pageSize, setPage, addUser, updateUser, deleteUser } = hook(id);

  return (
    <div className={styles.wrap}>
      <DataRender
        loading={loading}
        error={error}
        normalContent={() => (
          <div>
            <Banner
              fullMode={false}
              type="info"
              bordered
              icon={null}
              style={{ margin: '16px 0' }}
              title={<Title heading={6}>权限说明</Title>}
              description={
                <div>
                  {descriptions && descriptions.length ? (
                    descriptions.map((desc) => {
                      return <Paragraph key={desc}>{desc}</Paragraph>;
                    })
                  ) : (
                    <>
                      <Paragraph>超级管理员：管理组织内所有知识库、文档，可删除组织，默认创建者</Paragraph>
                      <Paragraph>管理员：管理组织内所有知识库、文档，不可删除组织</Paragraph>
                      <Paragraph>成员：可访问组织内所有知识库、文档，不可删除组织</Paragraph>
                    </>
                  )}
                </div>
              }
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <AddUser onOk={addUser}>
                <Button theme="solid">添加用户</Button>
              </AddUser>
            </div>
            <Table
              style={{ margin: '16px 0' }}
              dataSource={data.data}
              size="small"
              pagination={{
                currentPage: page,
                pageSize,
                total: data.total,
                onPageChange: setPage,
              }}
            >
              <Column title="用户名" dataIndex="user.name" key="user.name" />
              <Column
                title="成员权限"
                dataIndex="auth.auth"
                key="auth.auth"
                align="center"
                render={(auth) => AuthEnumTextMap[auth]}
              />
              <Column
                title="加入时间"
                dataIndex="auth.createdAt"
                key="auth.createdAt"
                align="center"
                render={(d) => <LocaleTime date={d} />}
              />
              <Column
                title="操作"
                dataIndex="operate"
                key="operate"
                align="center"
                render={(_, data) => (
                  <>
                    <EditUser userWithAuth={data} updateUser={updateUser}>
                      <Button type="tertiary" theme="borderless" icon={<IconEdit />} />
                    </EditUser>
                    <Popconfirm
                      showArrow
                      position="bottomRight"
                      zIndex={1070}
                      title="确认删除该成员？"
                      onConfirm={() => deleteUser({ userName: data.user.name, userAuth: data.auth.auth })}
                    >
                      <Button type="tertiary" theme="borderless" icon={<IconDelete />} />
                    </Popconfirm>
                  </>
                )}
              />
            </Table>
          </div>
        )}
      />
    </div>
  );
};
