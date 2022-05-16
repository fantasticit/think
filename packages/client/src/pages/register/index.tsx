import { Button, Form, Layout, Modal, Space, Typography } from '@douyinfe/semi-ui';
import { Author } from 'components/author';
import { LogoImage, LogoText } from 'components/logo';
import { Seo } from 'components/seo';
import { useAsyncLoading } from 'hooks/use-async-loading';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';
import { register as registerApi } from 'services/user';

import styles from './index.module.scss';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const Page = () => {
  const [registerWithLoading, loading] = useAsyncLoading(registerApi);

  const onFinish = (values) => {
    registerWithLoading(values).then((res) => {
      Modal.confirm({
        title: <Title heading={5}>注册成功</Title>,
        content: <Text>是否跳转至登录?</Text>,
        okText: '确认',
        cancelText: '取消',
        onOk() {
          Router.push('/login');
        },
      });
    });
  };

  return (
    <Layout className={styles.wrap}>
      <Seo title="注册" />
      <Content className={styles.content}>
        <Title heading={4} style={{ marginBottom: 16, textAlign: 'center' }}>
          <Space>
            <LogoImage></LogoImage>
            <LogoText></LogoText>
          </Space>
        </Title>
        <Form className={styles.form} initValues={{ name: '', password: '' }} onSubmit={onFinish}>
          <Title type="tertiary" heading={5} style={{ marginBottom: 16, textAlign: 'center' }}>
            用户注册
          </Title>
          <Form.Input
            noLabel
            field="name"
            label="账户"
            style={{ width: '100%' }}
            placeholder="输入账户名称"
            rules={[{ required: true, message: '请输入账户' }]}
          ></Form.Input>
          <Form.Input
            noLabel
            mode="password"
            field="password"
            label="密码"
            style={{ width: '100%' }}
            placeholder="输入用户密码"
            rules={[{ required: true, message: '请输入密码' }]}
          ></Form.Input>
          <Form.Input
            noLabel
            mode="password"
            field="confirmPassword"
            label="密码"
            style={{ width: '100%' }}
            placeholder="确认用户密码"
            rules={[{ required: true, message: '请再次输入密码' }]}
          ></Form.Input>
          <Button htmlType="submit" type="primary" theme="solid" block style={{ margin: '16px 0' }}>
            注册
          </Button>
          <footer>
            <Text link style={{ textAlign: 'center' }}>
              <Link href="/login">
                <a>使用其他账户登录</a>
              </Link>
            </Text>
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
