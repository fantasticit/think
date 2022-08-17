import { Avatar, Button, Col, Form, Modal, Row, Space, Toast } from '@douyinfe/semi-ui';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { Upload } from 'components/upload';
import { useSystemPublicConfig, useUser, useVerifyCode } from 'data/user';
import { useInterval } from 'hooks/use-interval';
import { useToggle } from 'hooks/use-toggle';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

interface IProps {
  visible: boolean;
  toggleVisible: Dispatch<SetStateAction<boolean>>;
}

export const UserSetting: React.FC<IProps> = ({ visible, toggleVisible }) => {
  const $form = useRef<FormApi>();
  const { user, loading, updateUser } = useUser();
  const [currentAvatar, setCurrentAvatar] = useState('');
  const [email, setEmail] = useState('');
  const { data: systemConfig } = useSystemPublicConfig();
  const { sendVerifyCode, loading: sendVerifyCodeLoading } = useVerifyCode();
  const [hasSendVerifyCode, toggleHasSendVerifyCode] = useToggle(false);
  const [countDown, setCountDown] = useState(0);

  const setAvatar = useCallback((url) => {
    $form.current.setValue('avatar', url);
    setCurrentAvatar(url);
  }, []);

  const handleOk = useCallback(() => {
    $form.current.validate().then((values) => {
      if (!values.email) {
        delete values.email;
      }
      updateUser(values).then(() => {
        Toast.success('账户信息已更新');
        toggleVisible(false);
      });
    });
  }, [toggleVisible, updateUser]);

  const handleCancel = useCallback(() => {
    toggleVisible(false);
  }, [toggleVisible]);

  const onFormChange = useCallback((formState) => {
    setEmail(formState.values.email);
  }, []);

  const { start, stop } = useInterval(() => {
    setCountDown((v) => {
      if (v - 1 <= 0) {
        stop();
        toggleHasSendVerifyCode(false);
        return 0;
      }
      return v - 1;
    });
  }, 1000);

  const getVerifyCode = useCallback(() => {
    stop();
    sendVerifyCode({ email })
      .then(() => {
        Toast.success('请前往邮箱查收验证码');
        setCountDown(60);
        start();
        toggleHasSendVerifyCode(true);
      })
      .catch(() => {
        toggleHasSendVerifyCode(false);
      });
  }, [email, toggleHasSendVerifyCode, sendVerifyCode, start, stop]);

  useEffect(() => {
    if (!user || !$form.current) return;
    $form.current.setValues(user);
    setCurrentAvatar(user.avatar);
  }, [user]);

  return (
    <Modal
      title="更新用户信息"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      style={{ maxWidth: '96vw' }}
      okButtonProps={{ loading }}
    >
      <Form
        initValues={{ avatar: user.avatar, name: user.name, email: user.email }}
        getFormApi={(formApi) => ($form.current = formApi)}
        labelPosition="left"
        onChange={onFormChange}
      >
        <Form.Slot label="头像">
          <Space align="end">
            <Avatar src={currentAvatar} shape="square"></Avatar>
            <Upload onOK={setAvatar} />
          </Space>
        </Form.Slot>

        <Form.Input
          label="账户"
          field="name"
          style={{ width: '100%' }}
          disabled
          placeholder="请输入账户名称"
        ></Form.Input>

        <Form.Input label="邮箱" field="email" style={{ width: '100%' }} placeholder="请输入账户邮箱"></Form.Input>

        {systemConfig && systemConfig.enableEmailVerify && email && email !== user.email ? (
          <Form.Slot label="验证码">
            <Row gutter={8}>
              <Col span={16}>
                <Form.Input
                  noLabel
                  fieldStyle={{ paddingTop: 0 }}
                  placeholder={'请输入验证码'}
                  field="verifyCode"
                  rules={[{ required: true, message: '请输入邮箱收到的验证码！' }]}
                />
              </Col>
              <Col span={8}>
                <Button
                  disabled={!email || countDown > 0}
                  loading={sendVerifyCodeLoading}
                  onClick={getVerifyCode}
                  block
                >
                  {hasSendVerifyCode ? countDown : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </Form.Slot>
        ) : null}
      </Form>
    </Modal>
  );
};
