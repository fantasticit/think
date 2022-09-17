import { Button, Col, Form, Row, Toast } from '@douyinfe/semi-ui';
import { useResetPassword, useSystemPublicConfig, useUser, useVerifyCode } from 'data/user';
import { useInterval } from 'hooks/use-interval';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback, useState } from 'react';

export const ResetPassword = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [hasSendVerifyCode, toggleHasSendVerifyCode] = useToggle(false);
  const [countDown, setCountDown] = useState(0);
  const { user } = useUser();
  const { reset, loading } = useResetPassword();
  const { data: systemConfig } = useSystemPublicConfig();
  const { sendVerifyCode, loading: sendVerifyCodeLoading } = useVerifyCode();

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

  const onFinish = useCallback(
    (values) => {
      reset(values).then((res) => {
        onSuccess && onSuccess();
      });
    },
    [reset, onSuccess]
  );

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

  return (
    <Form
      initValues={{ email: user ? user.email : '', password: '', confirmPassword: '' }}
      onChange={onFormChange}
      onSubmit={onFinish}
    >
      <Form.Input
        noLabel
        field="email"
        placeholder={'请输入邮箱'}
        rules={[
          {
            type: 'email',
            message: '请输入正确的邮箱地址!',
          },
          {
            required: true,
            message: '请输入邮箱地址!',
          },
        ]}
      />

      {systemConfig && systemConfig.enableEmailVerify ? (
        <Row gutter={8} style={{ paddingTop: 12 }}>
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
            <Button disabled={!email || countDown > 0} loading={sendVerifyCodeLoading} onClick={getVerifyCode} block>
              {hasSendVerifyCode ? countDown : '获取验证码'}
            </Button>
          </Col>
        </Row>
      ) : null}

      <Form.Input
        noLabel
        mode="password"
        field="password"
        label="密码"
        style={{ width: '100%' }}
        placeholder="输入用户密码"
        rules={[{ required: true, message: '请输入新密码' }]}
      />

      <Form.Input
        noLabel
        mode="password"
        field="confirmPassword"
        label="密码"
        style={{ width: '100%' }}
        placeholder="确认用户密码"
        rules={[{ required: true, message: '请再次输入密码' }]}
      />

      <Button htmlType="submit" type="primary" theme="solid" block loading={loading} style={{ margin: '16px 0' }}>
        重置密码
      </Button>
    </Form>
  );
};
