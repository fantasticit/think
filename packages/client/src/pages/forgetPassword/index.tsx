import { Layout, Modal, Space, Typography } from '@douyinfe/semi-ui';
import { Author } from 'components/author';
import { LogoImage, LogoText } from 'components/logo';
import { Seo } from 'components/seo';
import { ResetPassword } from 'components/user/reset-password';
import { useRouterQuery } from 'hooks/use-router-query';
import Link from 'next/link';
import Router from 'next/router';
import React, { useCallback } from 'react';

import styles from './index.module.scss';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const Page = () => {
  const query = useRouterQuery();

  const onResetSucccess = useCallback(() => {
    Modal.confirm({
      title: <Title heading={5}>密码修改成功</Title>,
      content: <Text>是否跳转至登录?</Text>,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        Router.push('/login', { query });
      },
    });
  }, [query]);

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
        <div className={styles.form}>
          <Title type="tertiary" heading={5} style={{ marginBottom: 16, textAlign: 'center' }}>
            重置密码
          </Title>
          <ResetPassword onSuccess={onResetSucccess} />
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
        </div>
      </Content>
      <Footer>
        <Author></Author>
      </Footer>
    </Layout>
  );
};

export default Page;
