import { IconUserAdd } from '@douyinfe/semi-icons';
import { Avatar, AvatarGroup, Button, Dropdown, Modal, Popover, Toast, Tooltip, Typography } from '@douyinfe/semi-ui';
import { Members } from 'components/members';
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

const { Text } = Typography;

const mobileContainerStyle: React.CSSProperties = { maxWidth: '96vw', maxHeight: '60vh', overflow: 'auto' };

const pcContainerStyle: React.CSSProperties = {
  width: 412,
  maxWidth: '96vw',
  padding: '0 24px',
  maxHeight: '60vh',
  overflow: 'auto',
};

export const DocumentCollaboration: React.FC<IProps> = ({ wikiId, documentId, disabled = false }) => {
  const { isMobile } = IsOnMobile.useHook();
  const toastedUsersRef = useRef([]);
  const { user: currentUser } = useUser();
  const [visible, toggleVisible] = useToggle(false);
  const [collaborationUsers, setCollaborationUsers] = useState([]);

  const content = useMemo(
    () =>
      !visible ? null : (
        <div style={{ padding: '24px 0' }}>
          <Members
            id={documentId}
            hook={useDoumentMembers}
            descriptions={[
              '权限继承：默认继承知识库成员权限',
              '超级管理员：组织超级管理员、知识库超级管理员和文档创建者',
            ]}
          />
        </div>
      ),
    [visible, documentId]
  );

  const btn = useMemo(
    () => (
      <Button theme="borderless" type="tertiary" disabled={disabled} icon={<IconUserAdd />} onClick={toggleVisible} />
    ),
    [disabled, toggleVisible]
  );

  const renderMore = useCallback((restNumber, restAvatars) => {
    const content = restAvatars.map((avatar, index) => {
      return (
        <div style={{ paddingBottom: 12 }} key={index}>
          {React.cloneElement(avatar, { size: 'extra-small' })}
          <Text style={{ marginLeft: 8, fontSize: 14 }}>{avatar.props.content}</Text>
        </div>
      );
    });
    return (
      <Popover
        content={<div style={{ maxHeight: '50vh', overflow: 'auto' }}>{content}</div>}
        autoAdjustOverflow={false}
        position={'bottomRight'}
        style={{ padding: '12px 8px', paddingBottom: 0 }}
      >
        <Avatar size="extra-small">{`+${restNumber}`}</Avatar>
      </Popover>
    );
  }, []);

  useEffect(() => {
    const handler = (users) => {
      const joinUsers = users
        .filter(Boolean)
        .filter((state) => state.user)
        .map((state) => ({ ...state.user, clientId: state.clientId }));

      const otherUsers = joinUsers
        .filter(Boolean)
        .filter((joinUser) => {
          return joinUser.name !== currentUser.name;
        })
        .filter((joinUser) => {
          return !toastedUsersRef.current.includes(joinUser.clientId);
        });

      if (otherUsers.length) {
        Toast.info(`${otherUsers[0].name}等${otherUsers.length}个用户加入文档`);

        otherUsers.forEach((joinUser) => {
          toastedUsersRef.current.push(joinUser.clientId);
        });
      }

      setCollaborationUsers(joinUsers);
    };

    event.on(JOIN_USER, handler);

    return () => {
      event.off(JOIN_USER, handler);
      toastedUsersRef.current = [];
    };
  }, [currentUser]);

  return (
    <>
      <AvatarGroup maxCount={2} renderMore={renderMore} size="extra-small">
        {collaborationUsers.map((user) => {
          return (
            <Tooltip key={user.clientId} content={`${user.name}-${user.clientId}`} position="bottom">
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
            style={mobileContainerStyle}
          >
            {content}
          </Modal>
          {btn}
        </>
      ) : (
        <Dropdown
          stopPropagation={true}
          visible={visible}
          onVisibleChange={toggleVisible}
          trigger="click"
          position="bottomRight"
          content={<div style={pcContainerStyle}>{content}</div>}
        >
          {btn}
        </Dropdown>
      )}
    </>
  );
};
