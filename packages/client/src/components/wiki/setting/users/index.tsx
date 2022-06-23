import { IconDelete, IconEdit } from '@douyinfe/semi-icons';
import { Button, Popconfirm, Table } from '@douyinfe/semi-ui';
import { getWikiUserRoleText } from '@think/domains';
import { DataRender } from 'components/data-render';
import { LocaleTime } from 'components/locale-time';
import { useWikiMembers } from 'data/wiki';
import { useToggle } from 'hooks/use-toggle';
import React, { useState } from 'react';

import { AddUser } from './add';
import { EditUser } from './edit';
import { Placeholder } from './placeholder';

interface IProps {
  wikiId: string;
}

const { Column } = Table;

export const Users: React.FC<IProps> = ({ wikiId }) => {
  const [visible, toggleVisible] = useToggle(false);
  const [editVisible, toggleEditVisible] = useToggle(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { users, loading, error, addUser, updateUser, deleteUser } = useWikiMembers(wikiId);

  const editUser = (user) => {
    setCurrentUser(user);
    toggleEditVisible(true);
  };

  const handleEdit = (userRole) => {
    return updateUser({ userName: currentUser.userName, userRole }).then(() => {
      setCurrentUser(null);
    });
  };

  return (
    <>
      <DataRender
        loading={loading}
        error={error}
        loadingContent={<Placeholder />}
        normalContent={() => (
          <div style={{ margin: '24px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={toggleVisible} theme="solid">
                添加用户
              </Button>
            </div>
            <Table style={{ margin: '16px 0' }} dataSource={users} size="small" pagination>
              <Column title="用户名" dataIndex="userName" key="userName" />
              <Column
                title="成员角色"
                dataIndex="userRole"
                key="userRole"
                align="center"
                render={getWikiUserRoleText}
              />
              <Column
                title="加入时间"
                dataIndex="createdAt"
                key="createdAt"
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
                    <Popconfirm showArrow title="确认删除该成员？" onConfirm={() => deleteUser(data)}>
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
      <EditUser visible={editVisible} toggleVisible={toggleEditVisible} onOk={handleEdit} />
    </>
  );
};
