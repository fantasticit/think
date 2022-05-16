import { Checkbox, Modal, Table, Typography } from '@douyinfe/semi-ui';
import { IAuthority, IUser } from '@think/domains';
import { DocAuth } from 'data/document';
import React, { useMemo } from 'react';

interface IProps {
  visible: boolean;
  toggleVisible: (arg: boolean) => void;
  mentionUsers: string[];
  users: Array<{ user: IUser; auth: IAuthority }>;
  addUser: (auth: DocAuth) => Promise<unknown>;
  updateUser: (auth: DocAuth) => Promise<unknown>;
}

const { Text } = Typography;
const { Column } = Table;

// eslint-disable-next-line react/display-name
const renderChecked = (onChange, authKey: 'readable' | 'editable') => (checked, data) => {
  const handle = (evt) => {
    const ret = {
      ...data,
    };
    ret[authKey] = evt.target.checked;
    onChange(ret);
  };
  return <Checkbox style={{ display: 'inline-block' }} checked={checked} onChange={handle} />;
};

export const DocumentUserSetting: React.FC<IProps> = ({
  visible,
  toggleVisible,
  mentionUsers,
  users,
  addUser,
  updateUser,
}) => {
  const renderUsers = useMemo(() => {
    return mentionUsers
      .map((mentionUser) => {
        const exist = users.find((user) => {
          return user.user.name === mentionUser;
        });

        if (!exist) return { userName: mentionUser, readable: false, editable: false, shouldAddToDocument: true };

        return {
          userName: mentionUser,
          readable: exist.auth.readable,
          editable: exist.auth.editable,
          shouldAddToDocument: false,
        };
      })
      .filter(Boolean);
  }, [users, mentionUsers]);

  const handler = async (data) => {
    if (data.shouldAddToDocument) {
      await addUser(data.userName);
    }

    await updateUser(data);
  };

  return (
    <Modal
      title={'权限操作'}
      visible={visible}
      onCancel={() => toggleVisible(false)}
      maskClosable={false}
      style={{ maxWidth: '96vw' }}
      footer={null}
    >
      <Text>您在该文档中 @ 了以下用户，请为他们操作权限，否则他们无法阅读该文档。</Text>
      <Table style={{ margin: '24px 0' }} dataSource={renderUsers} size="small" pagination>
        <Column title="用户名" dataIndex="userName" key="name" />
        <Column
          title="是否可读"
          dataIndex="readable"
          key="readable"
          render={renderChecked(handler, 'readable')}
          align="center"
        />
        <Column
          title="是否可编辑"
          dataIndex="editable"
          key="editable"
          render={renderChecked(handler, 'editable')}
          align="center"
        />
      </Table>
    </Modal>
  );
};
