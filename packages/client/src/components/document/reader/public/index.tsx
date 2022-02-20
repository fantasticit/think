import React, { useMemo, useEffect } from "react";
import cls from "classnames";
import {
  Layout,
  Nav,
  Space,
  Button,
  Typography,
  Skeleton,
  Input,
  Popover,
  Modal,
  BackTop,
} from "@douyinfe/semi-ui";
import { IconArticle } from "@douyinfe/semi-icons";
import { Seo } from "components/seo";
import { LogoImage, LogoText } from "components/logo";
import { DataRender } from "components/data-render";
import { DocumentStyle } from "components/document/style";
import { User } from "components/user";
import { Theme } from "components/theme";
import { useDocumentStyle } from "hooks/useDocumentStyle";
import { usePublicDocument } from "data/document";
import { DocumentSkeleton } from "components/tiptap";
import { DocumentContent } from "../content";
import { CreateUser } from "../user";
import styles from "./index.module.scss";

const { Header, Content } = Layout;
const { Text, Title } = Typography;

interface IProps {
  documentId: string;
  hideLogo?: boolean;
}

export const DocumentPublicReader: React.FC<IProps> = ({
  documentId,
  hideLogo = true,
}) => {
  if (!documentId) return null;

  const { data, loading, error, query } = usePublicDocument(documentId);

  const { width, fontSize } = useDocumentStyle();
  const editorWrapClassNames = useMemo(() => {
    return width === "standardWidth"
      ? styles.isStandardWidth
      : styles.isFullWidth;
  }, [width]);

  useEffect(() => {
    if (!error) return;
    if (error.statusCode !== 400) return;
    Modal.confirm({
      title: "请输入密码",
      content: (
        <>
          <Seo title={"输入密码后查看"} />
          <Input
            id="js-share-document-password"
            style={{ marginTop: 24 }}
            autofocus
            mode="password"
            placeholder="请输入密码"
          />
        </>
      ),
      closable: false,
      hasCancel: false,
      maskClosable: false,
      onOk() {
        const $input = document.querySelector(
          "#js-share-document-password"
        ) as HTMLInputElement;
        query($input.value);
      },
    });
  }, [error, query]);

  return (
    <Layout className={styles.wrap}>
      <Header className={styles.headerWrap}>
        <Nav
          mode="horizontal"
          header={
            !hideLogo ? (
              <>
                <LogoImage />
                <LogoText />
              </>
            ) : null
          }
          footer={
            <Space>
              <Popover
                key="style"
                zIndex={1061}
                position="bottomLeft"
                content={<DocumentStyle />}
              >
                <Button
                  icon={<IconArticle />}
                  theme="borderless"
                  type="tertiary"
                />
              </Popover>
              <Theme />
              <User />
            </Space>
          }
        >
          <DataRender
            loading={loading}
            error={error}
            loadingContent={
              <Skeleton
                active
                placeholder={
                  <Skeleton.Title style={{ width: 80, marginBottom: 8 }} />
                }
                loading={true}
              />
            }
            normalContent={() => (
              <Text
                strong
                ellipsis={{ showTooltip: true }}
                style={{ width: 120 }}
              >
                {data.title}
              </Text>
            )}
          />
        </Nav>
      </Header>
      <Content className={styles.contentWrap}>
        <DataRender
          loading={loading}
          error={error}
          loadingContent={
            <div
              className={cls(styles.editorWrap, editorWrapClassNames)}
              style={{ fontSize }}
            >
              <DocumentSkeleton />
            </div>
          }
          normalContent={() => {
            return (
              <>
                <Seo title={data.title} />
                <div
                  className={cls(styles.editorWrap, editorWrapClassNames)}
                  style={{ fontSize }}
                  id="js-share-document-editor-container"
                >
                  <Title>{data.title}</Title>
                  <div style={{ margin: "24px 0" }}>
                    <CreateUser document={data} />
                  </div>
                  <DocumentContent document={data} />
                </div>
                <BackTop
                  target={() =>
                    document.querySelector(
                      "#js-share-document-editor-container"
                    ).parentNode
                  }
                />
              </>
            );
          }}
        />
      </Content>
    </Layout>
  );
};
