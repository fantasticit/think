import { IconDelete, IconUserAdd } from '@douyinfe/semi-icons';
import {
  Avatar,
  AvatarGroup,
  Button,
  Checkbox,
  Dropdown,
  Input,
  Modal,
  Popconfirm,
  Popover,
  Spin,
  Table,
  TabPane,
  Tabs,
  Toast,
  Tooltip,
  Typography,
} from '@douyinfe/semi-ui';
import { IUser } from '@think/domains';
import { DataRender } from 'components/data-render';
import { DocumentLinkCopyer } from 'components/document/link';
import { useDoumentMembers } from 'data/document';
import { useUser } from 'data/user';
import { event, JOIN_USER } from 'event';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface IProps {
  wikiId: string;
  documentId: string;
  disabled?: boolean;
}

const { Paragraph } = Typography;
const { Column } = Table;

// eslint-disable-next-line react/display-name
const renderChecked = (onChange, authKey: 'readable' | 'editable') => (checked, docAuth) => {
  const handle = (evt) => {
    const data = {
      ...docAuth.auth,
      userName: docAuth.user.name,
    };
    data[authKey] = evt.target.checked;
    onChange(data);
  };

  return <Checkbox style={{ display: 'inline-block' }} checked={checked} onChange={handle} />;
};

export const DocumentCollaboration: React.FC<IProps> = ({ wikiId, documentId, disabled = false }) => {
  const { isMobile } = IsOnMobile.useHook();
  const toastedUsersRef = useRef<Array<IUser['id']>>([]);
  const ref = useRef<HTMLInputElement>();
  const { user: currentUser } = useUser();
  const [visible, toggleVisible] = useToggle(false);
  const { users, loading, error, addUser, updateUser, deleteUser } = useDoumentMembers(documentId, {
    enabled: visible,
  });
  const [inviteUser, setInviteUser] = useState('');
  const [collaborationUsers, setCollaborationUsers] = useState([]);

  const handleOk = useCallback(() => {
    addUser(inviteUser).then(() => {
      Toast.success('添加成功');
      setInviteUser('');
    });
  }, [addUser, inviteUser]);

  const handleDelete = useCallback(
    (docAuth) => {
      const data = {
        ...docAuth.auth,
        userName: docAuth.user.name,
      };
      deleteUser(data);
    },
    [deleteUser]
  );

  const content = useMemo(
    () => (
      <Tabs type="line">
        <TabPane tab="添加成员" itemKey="add">
          <div style={{ marginTop: 16 }}>
            <Input ref={ref} placeholder="输入对方用户名" value={inviteUser} onChange={setInviteUser}></Input>
            <Paragraph style={{ marginTop: 16 }}>
              邀请成功后，请将该链接发送给对方。
              <span style={{ verticalAlign: 'middle' }}>
                <DocumentLinkCopyer wikiId={wikiId} documentId={documentId} />
              </span>
            </Paragraph>
            <Button theme="solid" block style={{ margin: '24px 0' }} disabled={!inviteUser} onClick={handleOk}>
              添加用户
            </Button>
          </div>
        </TabPane>
        <TabPane tab="协作成员" itemKey="list">
          <DataRender
            loading={loading}
            error={error}
            loadingContent={<Spin />}
            normalContent={() => (
              <Table dataSource={users} size="small" pagination>
                <Column title="用户名" dataIndex="user.name" key="name" />
                <Column
                  title="是否可读"
                  dataIndex="auth.readable"
                  key="readable"
                  render={renderChecked(updateUser, 'readable')}
                  align="center"
                />
                <Column
                  title="是否可编辑"
                  dataIndex="auth.editable"
                  key="editable"
                  render={renderChecked(updateUser, 'editable')}
                  align="center"
                />
                <Column
                  title="操作"
                  dataIndex="operate"
                  key="operate"
                  render={(_, document) => (
                    <Popconfirm showArrow title="确认删除该成员？" onConfirm={() => handleDelete(document)}>
                      <Button type="tertiary" theme="borderless" icon={<IconDelete />} />
                    </Popconfirm>
                  )}
                />
              </Table>
            )}
          />
        </TabPane>
      </Tabs>
    ),
    [documentId, error, handleDelete, handleOk, inviteUser, loading, updateUser, users, wikiId]
  );

  const btn = useMemo(
    () => (
      <Button theme="borderless" type="tertiary" disabled={disabled} icon={<IconUserAdd />} onClick={toggleVisible} />
    ),
    [disabled, toggleVisible]
  );

  useEffect(() => {
    if (visible) {
      setTimeout(() => ref.current?.focus(), 100);
    }
  }, [visible]);

  useEffect(() => {
    const handler = (mentionUsers) => {
      const newCollaborationUsers = mentionUsers
        .filter(Boolean)
        .filter((state) => state.user)
        .map((state) => ({ ...state.user, clientId: state.clientId }));

      if (
        collaborationUsers.length === newCollaborationUsers.length &&
        newCollaborationUsers.every((newUser) => {
          return collaborationUsers.find((existUser) => existUser.id === newUser.id);
        })
      ) {
        return;
      }

      newCollaborationUsers.forEach((newUser) => {
        if (currentUser && newUser.name !== currentUser.name && !toastedUsersRef.current.includes(newUser.id)) {
          Toast.info(`${newUser.name}加入文档`);
          toastedUsersRef.current.push(newUser.id);
        }
      });

      setCollaborationUsers(newCollaborationUsers);
    };

    event.on(JOIN_USER, handler);

    return () => {
      toastedUsersRef.current = [];
      event.off(JOIN_USER, handler);
    };
  }, [collaborationUsers, currentUser]);

  if (error)
    return (
      <Tooltip content="邀请他人协作" position="bottom">
        <Button theme="borderless" type="tertiary" icon={<IconUserAdd />}></Button>
      </Tooltip>
    );

  return (
    <>
      <AvatarGroup maxCount={5} size="extra-small">
        {collaborationUsers.map((user) => {
          return (
            <Tooltip key={user.id} content={`${user.name}`} position="bottom">
              <Avatar src={user.avatar} size="extra-small">
                {user.name && user.name.charAt(0)}
              </Avatar>
            </Tooltip>
          );
        })}
      </AvatarGroup>
      {isMobile ? (
        <>
          <Modal
            centered
            title="文档协作"
            visible={visible}
            footer={null}
            onCancel={toggleVisible}
            style={{ maxWidth: '96vw' }}
          >
            {content}
          </Modal>
          {btn}
        </>
      ) : (
        <Dropdown
          visible={visible}
          onVisibleChange={toggleVisible}
          trigger="click"
          position="bottomRight"
          content={
            <div
              style={{
                width: 412,
                maxWidth: '96vw',
                padding: '0 24px',
              }}
            >
              {content}
            </div>
          }
        >
          {btn}
        </Dropdown>
      )}
    </>
  );
};
