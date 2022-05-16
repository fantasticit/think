import { IconSpin } from '@douyinfe/semi-icons';
import { Avatar, Button, Dropdown, Typography } from '@douyinfe/semi-ui';
import { useUser } from 'data/user';
import { useToggle } from 'hooks/use-toggle';
import React from 'react';

import { UserSetting } from './setting';

const { Text } = Typography;

export const User: React.FC = () => {
  const { user, loading, error, gotoLogin, logout } = useUser();
  const [visible, toggleVisible] = useToggle(false);

  if (loading) return <Button icon={<IconSpin />} theme="borderless" type="tertiary" />;

  if (error || !user) {
    return (
      <Button theme="solid" type="primary" size="small" onClick={gotoLogin}>
        登录
      </Button>
    );
  }

  return (
    <>
      <Dropdown
        trigger="click"
        position="bottomRight"
        render={
          <Dropdown.Menu style={{ width: 160 }}>
            <Dropdown.Item onClick={() => toggleVisible(true)}>
              <Text>账户设置</Text>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={logout}>
              <Text>退出登录</Text>
            </Dropdown.Item>
          </Dropdown.Menu>
        }
      >
        <Button
          icon={
            user.avatar ? (
              <Avatar size="extra-extra-small" src={user.avatar}></Avatar>
            ) : (
              <Avatar size="extra-extra-small" color="orange">
                {user && user.name[0]}
              </Avatar>
            )
          }
          theme="borderless"
          type="tertiary"
        />
      </Dropdown>
      <UserSetting visible={visible} toggleVisible={toggleVisible} />
    </>
  );
};
