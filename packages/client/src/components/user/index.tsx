import { IconSpin } from '@douyinfe/semi-icons';
import { Avatar, Button, Dropdown, Modal, Toast, Typography } from '@douyinfe/semi-ui';
import { useUser } from 'data/user';
import { useToggle } from 'hooks/use-toggle';
import Router from 'next/router';
import React, { useCallback } from 'react';

import { ResetPassword } from './reset-password';
import { UserSetting } from './setting';

const { Text } = Typography;

export const User: React.FC = () => {
  const { user, loading, error, toLogin, logout } = useUser();
  const [visible, toggleVisible] = useToggle(false);
  const [resetVisible, toggleResetVisible] = useToggle(false);

  const toAdmin = useCallback(() => {
    Router.push('/admin');
  }, []);

  const onResetSuccess = useCallback(() => {
    Toast.success('请重新登录');
    Router.replace(`/login?redirect=${Router.asPath}`);
  }, []);

  if (loading) return <Button icon={<IconSpin />} theme="borderless" type="tertiary" />;

  if (error || !user) {
    return (
      <Button theme="solid" type="primary" size="small" onClick={toLogin}>
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
            <Dropdown.Item onClick={toggleResetVisible}>
              <Text>重置密码</Text>
            </Dropdown.Item>
            {user.isSystemAdmin ? (
              <Dropdown.Item onClick={toAdmin}>
                <Text>管理后台</Text>
              </Dropdown.Item>
            ) : null}
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
                {user && user.name && user.name[0]}
              </Avatar>
            )
          }
          theme="borderless"
          type="tertiary"
        />
      </Dropdown>
      <UserSetting visible={visible} toggleVisible={toggleVisible} />
      <Modal title="重置密码" visible={resetVisible} onCancel={toggleResetVisible} footer={null}>
        <ResetPassword onSuccess={onResetSuccess} />
      </Modal>
    </>
  );
};
