import { IconDelete, IconEdit } from '@douyinfe/semi-icons';
import { Banner, Button, Popconfirm, Table, Typography } from '@douyinfe/semi-ui';
import { AuthEnumTextMap, IOrganization } from '@think/domains';
import { DataRender } from 'components/data-render';
import { LocaleTime } from 'components/locale-time';
import { useOrganizationMembers } from 'data/organization';
import { useToggle } from 'hooks/use-toggle';
import React, { useState } from 'react';

import { AddUser } from './add';
import { EditUser } from './edit';
import styles from './index.module.scss';

interface IProps {
  id: string;
  hook: any;
}

const { Title, Paragraph } = Typography;
const { Column } = Table;

export const Members: React.FC<IProps> = ({ id, hook }) => {
  const { data, loading, error, addUser, updateUser, deleteUser } = hook(id);
  const [visible, toggleVisible] = useToggle(false);
  const [editVisible, toggleEditVisible] = useToggle(false);
  const [currentUser, setCurrentUser] = useState(null);

  const editUser = (user) => {
    setCurrentUser(user);
    toggleEditVisible(true);
  };

  const handleEdit = (userAuth) => {
    return updateUser({ userName: currentUser.user.name, userAuth }).then(() => {
      setCurrentUser(null);
    });
  };

  console.log(data);

  return (
    <div className={styles.wrap}>
      <header>{/* <MemberAdder /> */}</header>
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
                  <Paragraph>创建者：管理组织内所有知识库、文档，可删除组织</Paragraph>
                  <Paragraph>管理员：管理组织内所有知识库、文档，不可删除组织</Paragraph>
                  <Paragraph>成员：可访问组织内所有知识库、文档，不可删除组织</Paragraph>
                </div>
              }
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button theme="solid" onClick={toggleVisible}>
                添加用户
              </Button>
            </div>
            <Table style={{ margin: '16px 0' }} dataSource={data.data} size="small" pagination={false}>
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
                    <Button type="tertiary" theme="borderless" icon={<IconEdit />} onClick={() => editUser(data)} />
                    <Popconfirm
                      showArrow
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

      <AddUser visible={visible} toggleVisible={toggleVisible} onOk={addUser} />
      <EditUser visible={editVisible} toggleVisible={toggleEditVisible} currentUser={currentUser} onOk={handleEdit} />
    </div>
  );
};
