import { Breadcrumb, Button, Form, Layout, Nav, Skeleton, Space, Tooltip, Typography } from '@douyinfe/semi-ui';
import { IconRoute } from '@douyinfe/semi-icons';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { DataRender } from 'components/data-render';
import { Divider } from 'components/divider';
import { DocumentStyle } from 'components/document/style';
import { LogoImage, LogoText } from 'components/logo';
import { Seo } from 'components/seo';
import { Theme } from 'components/theme';
import { User } from 'components/user';
import { usePublicDocumentDetail } from 'data/document';
import { useMount } from 'hooks/use-mount';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { SecureDocumentIllustration } from 'illustrations/secure-document';
import Link from 'next/link';
import React, { useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CollaborationEditor } from 'tiptap/editor';

import { Author } from '../author';
import styles from './index.module.scss';
import Router from 'next/router';
import { useRouterQuery } from 'hooks/use-router-query';
import { IDocument, IWiki } from '@think/domains';
import { DocumentFullscreen } from 'components/document/fullscreen';

const { Header } = Layout;
const { Text } = Typography;

interface IProps {
  documentId: string;
  hideLogo?: boolean;
}

export const DocumentPublicReader: React.FC<IProps> = ({ documentId, hideLogo = false }) => {
  const $form = useRef<FormApi>();
  const mounted = useMount();
  const { wikiId: currentWikiId } = useRouterQuery<{ wikiId: IWiki['id']; documentId: IDocument['id'] }>();
  const { data, loading, error, query } = usePublicDocumentDetail(documentId);
  const { isMobile } = IsOnMobile.useHook();
 
  const renderAuthor = useCallback(
    (element) => {
      if (!document) return null;

      const target = element && element.querySelector('.ProseMirror .title');

      if (target) {
        return createPortal(<Author document={data} />, target);
      }

      return null;
    },
    [data]
  );

  const handleOk = useCallback(() => {
    $form.current.validate().then((values) => {
      query(values.password);
    });
  }, [query]);

  const toPublicWikiOrDocumentURL = useCallback(() => {
    Router.push({
      pathname: currentWikiId ? '/share/document/[documentId]' : '/share/wiki/[wikiId]/document/[documentId]',
      query: currentWikiId ? { documentId } : { wikiId: data.wikiId, documentId },
    });
  }, [currentWikiId, documentId, data]);

  const content = useMemo(() => {
    if (error) {
      // @ts-ignore
      if (error.statusCode === 400) {
        return (
          <div>
            <Seo title={'输入密码后查看'} />
            <Form
              style={{ width: 320, maxWidth: 'calc(100vw - 160px)', margin: '10vh auto' }}
              initValues={{ password: '' }}
              getFormApi={(formApi) => ($form.current = formApi)}
              labelPosition="left"
              onSubmit={handleOk}
              layout="horizontal"
            >
              <Form.Input autofocus label="密码" field="password" placeholder="请输入密码" />
              <Button type="primary" theme="solid" htmlType="submit">
                提交
              </Button>
            </Form>
          </div>
        );
      }
      // @ts-ignore
      return (
        <div
          style={{
            margin: '10%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <SecureDocumentIllustration />
          <Text style={{ marginTop: 12 }} type="danger">
            {(error && (error as Error).message) || '未知错误'}
          </Text>
        </div>
      );
    }

    return (
      <>
        {data && <Seo title={data.title} />}
        {mounted && (
          <CollaborationEditor
            menubar={false}
            editable={false}
            user={null}
            id={documentId}
            type="document"
            renderInEditorPortal={renderAuthor}
          />
        )}
      </>
    );
  }, [error, data, mounted, documentId, renderAuthor, handleOk]);

  return (
    <Layout className={styles.wrap}>
      <Header className={styles.headerWrap}>
        <Nav
          mode="horizontal"
          header={
            !hideLogo && !isMobile ? (
              <>
                <Space>
                  <LogoImage />
                  <LogoText />
                </Space>
                <Divider margin={12} />
              </>
            ) : null
          }
          footer={
            <Space>
              {!isMobile && data && <DocumentFullscreen data={data}/>}
              <Tooltip content={currentWikiId ? '独立模式' : '嵌入模式'}>
                <Button theme="borderless" type="tertiary" icon={<IconRoute />} onClick={toPublicWikiOrDocumentURL} />
              </Tooltip>

              <DocumentStyle />
              <Theme />
              <User />
            </Space>
          }
        >
          <DataRender
            loading={loading}
            error={error}
            loadingContent={<Skeleton active placeholder={<Skeleton.Title style={{ width: 80 }} />} loading={true} />}
            normalContent={() => (
              <Breadcrumb>
                <Breadcrumb.Item>
                  <Link href="/share/wiki/[wikiId]" as={`/share/wiki/${data.wikiId}`}>
                    <a>{data?.wiki?.name}</a>
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{data.title}</Breadcrumb.Item>
              </Breadcrumb>
            )}
          />
        </Nav>
      </Header>
      <div className={styles.contentWrap} id="js-tocs-container">
        {content}
      </div>
    </Layout>
  );
};
