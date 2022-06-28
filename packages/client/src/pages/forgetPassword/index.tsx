import { Button, Col, Form, Layout, Modal, Row, Space, Toast, Typography } from '@douyinfe/semi-ui';
import { Author } from 'components/author';
import { LogoImage, LogoText } from 'components/logo';
import { Seo } from 'components/seo';
import { useResetPassword, useVerifyCode } from 'data/user';
import { useInterval } from 'hooks/use-interval';
import { useRouterQuery } from 'hooks/use-router-query';
import { useToggle } from 'hooks/use-toggle';
import Link from 'next/link';
import Router from 'next/router';
import React, { useCallback, useState } from 'react';

import styles from './index.module.scss';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const Page = () => {
  const query = useRouterQuery();

  const [email, setEmail] = useState('');
  const [hasSendVerifyCode, toggleHasSendVerifyCode] = useToggle(false);
  const [countDown, setCountDown] = useState(0);
  const { reset, loading } = useResetPassword();
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
        Modal.confirm({
          title: <Title heading={5}>密码修改成功</Title>,
          content: <Text>是否跳转至登录?</Text>,
          okText: '确认',
          cancelText: '取消',
          onOk() {
            Router.push('/login', { query });
          },
        });
      });
    },
    [reset, query]
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
    <Layout className={styles.wrap}>
      <Seo title="重置密码" />
      <Content className={styles.content}>
        <Title heading={4} style={{ marginBottom: 16, textAlign: 'center' }}>
          <Space>
            <LogoImage></LogoImage>
            <LogoText></LogoText>
          </Space>
        </Title>
        <Form
          className={styles.form}
          initValues={{ name: '', password: '' }}
          onChange={onFormChange}
          onSubmit={onFinish}
        >
          <Title type="tertiary" heading={5} style={{ marginBottom: 16, textAlign: 'center' }}>
            重置密码
          </Title>

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
          <footer>
            <Link
              href={{
                pathname: '/login',
                query,
              }}
            >
              <Text link style={{ textAlign: 'center' }}>
                去登录
              </Text>
            </Link>
          </footer>
        </Form>
      </Content>
      <Footer>
        <Author></Author>
      </Footer>
    </Layout>
  );
};

export default Page;
