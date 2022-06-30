import { IconUserAdd } from '@douyinfe/semi-icons';
import { Avatar, AvatarGroup, Button, Dropdown, Modal, Toast, Tooltip } from '@douyinfe/semi-ui';
import { Members } from 'components/members';
import { useDoumentMembers } from 'data/document';
import { useUser } from 'data/user';
import { event, JOIN_USER } from 'event';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { useToggle } from 'hooks/use-toggle';
import React, { useEffect, useMemo, useRef, useState } from 'react';

interface IProps {
  wikiId: string;
  documentId: string;
  disabled?: boolean;
}

export const DocumentCollaboration: React.FC<IProps> = ({ wikiId, documentId, disabled = false }) => {
  const { isMobile } = IsOnMobile.useHook();
  const toastedUsersRef = useRef([]);
  const { user: currentUser } = useUser();
  const [visible, toggleVisible] = useToggle(false);
  const [collaborationUsers, setCollaborationUsers] = useState([]);
  const content = useMemo(
    () => (
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
    [documentId]
  );
  const btn = useMemo(
    () => (
      <Button theme="borderless" type="tertiary" disabled={disabled} icon={<IconUserAdd />} onClick={toggleVisible} />
    ),
    [disabled, toggleVisible]
  );

  useEffect(() => {
    const handler = (users) => {
      const joinUsers = users
        .filter(Boolean)
        .filter((state) => state.user)
        .map((state) => ({ ...state.user, clientId: state.clientId }));

      joinUsers
        .filter(Boolean)
        .filter((joinUser) => {
          return joinUser.name !== currentUser.name;
        })
        .forEach((joinUser) => {
          if (!toastedUsersRef.current.includes(joinUser.clientId)) {
            Toast.info(`${joinUser.name}-${joinUser.clientId}加入文档`);
            toastedUsersRef.current.push(joinUser.clientId);
          }
        });

      setCollaborationUsers(joinUsers);
    };

    event.on(JOIN_USER, handler);

    return () => {
      toastedUsersRef.current = [];
      event.off(JOIN_USER, handler);
    };
  }, [currentUser]);

  return (
    <>
      <AvatarGroup maxCount={5} size="extra-small">
        {collaborationUsers.map((user) => {
          return (
            <Tooltip key={user.id} content={`${user.name}-${user.clientId}`} position="bottom">
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
            style={{ maxWidth: '96vw', maxHeight: '60vh', overflow: 'auto' }}
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
          content={
            <div
              style={{
                width: 412,
                maxWidth: '96vw',
                padding: '0 24px',
                maxHeight: '60vh',
                overflow: 'auto',
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
