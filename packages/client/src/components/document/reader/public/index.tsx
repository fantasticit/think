import {
  BackTop,
  Breadcrumb,
  Button,
  Form,
  Layout,
  Nav,
  Skeleton,
  Space,
  Typography,
} from '@douyinfe/semi-ui';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import cls from 'classnames';
import { DataRender } from 'components/data-render';
import { DocumentStyle } from 'components/document/style';
import { ImageViewer } from 'components/image-viewer';
import { LogoImage, LogoText } from 'components/logo';
import { Seo } from 'components/seo';
import { Theme } from 'components/theme';
import { User } from 'components/user';
import { usePublicDocumentDetail } from 'data/document';
import { useDocumentStyle } from 'hooks/use-document-style';
import { useMount } from 'hooks/use-mount';
import { IsOnMobile } from 'hooks/use-on-mobile';
import Link from 'next/link';
import React, { useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CollaborationEditor } from 'tiptap/editor';

import { Author } from '../author';
import styles from './index.module.scss';

const { Header, Content } = Layout;
const { Text } = Typography;

interface IProps {
  documentId: string;
  hideLogo?: boolean;
}

export const DocumentPublicReader: React.FC<IProps> = ({ documentId, hideLogo = false }) => {
  const $form = useRef<FormApi>();
  const mounted = useMount()
  const { data, loading, error, query } = usePublicDocumentDetail(documentId);
  const { width, fontSize } = useDocumentStyle();
  const { isMobile } = IsOnMobile.useHook();
  const editorWrapClassNames = useMemo(() => {
    return width === 'standardWidth' ? styles.isStandardWidth : styles.isFullWidth;
  }, [width]);

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

  if (!documentId) return null;

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
      return <Text>{error.message || error || '未知错误'}</Text>;
    }

    return (
      <div
          id="js-share-document-editor-container"
          className={cls(styles.editorWrap, editorWrapClassNames)}
          style={{ fontSize }}
        >
          {data && <Seo title={data.title} />}
          {mounted && <CollaborationEditor
            menubar={false}
            editable={false}
            user={null}
            id={documentId}
            type="document"
            renderInEditorPortal={renderAuthor}
          />}
          <ImageViewer containerSelector="#js-share-document-editor-container" />
          <BackTop
            style={{ bottom: 65, right: isMobile ? 16 : 100 }}
            target={() => document.querySelector('#js-share-document-editor-container').parentNode}
          />
        </div>
    )
  }, [error, data, mounted, editorWrapClassNames, fontSize])

  return (
    <Layout className={styles.wrap}>
      <Header className={styles.headerWrap}>
        <Nav
          mode="horizontal"
          header={
            !hideLogo && !isMobile ? (
              <>
                <LogoImage />
                <LogoText />
              </>
            ) : null
          }
          footer={
            <Space>
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
      <Content className={styles.contentWrap}>
         {content}
      </Content>
    </Layout>
  );
};
