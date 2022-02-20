import Router from "next/router";
import React, { useCallback, useMemo } from "react";
import {
  Layout,
  Nav,
  Skeleton,
  Typography,
  Space,
  Button,
  Tooltip,
  Spin,
  Popover,
} from "@douyinfe/semi-ui";
import { IconChevronLeft, IconArticle } from "@douyinfe/semi-icons";
import { useUser } from "data/user";
import { useDocumentDetail } from "data/document";
import { Seo } from "components/seo";
import { Theme } from "components/theme";
import { DataRender } from "components/data-render";
import { DocumentShare } from "components/document/share";
import { DocumentStar } from "components/document/star";
import { DocumentCollaboration } from "components/document/collaboration";
import { DocumentStyle } from "components/document/style";
import { useDocumentStyle } from "hooks/useDocumentStyle";
import { Editor } from "./editor";
import styles from "./index.module.scss";

const { Header, Content } = Layout;
const { Text } = Typography;

interface IProps {
  documentId: string;
}

export const DocumentEditor: React.FC<IProps> = ({ documentId }) => {
  if (!documentId) return null;

  const { width, fontSize } = useDocumentStyle();
  const editorWrapClassNames = useMemo(() => {
    return width === "standardWidth"
      ? styles.isStandardWidth
      : styles.isFullWidth;
  }, [width]);

  const { user } = useUser();
  const {
    data: documentAndAuth,
    loading: docAuthLoading,
    error: docAuthError,
  } = useDocumentDetail(documentId);
  const { document, authority } = documentAndAuth || {};

  const goback = useCallback(() => {
    Router.push({
      pathname: `/wiki/${document.wikiId}/document/${documentId}`,
    });
  }, [document]);

  const DocumentTitle = (
    <>
      <Tooltip content="返回" position="bottom">
        <Button
          onClick={goback}
          icon={<IconChevronLeft />}
          style={{ marginRight: 16 }}
        />
      </Tooltip>
      <DataRender
        loading={docAuthLoading}
        error={docAuthError}
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
          <Text ellipsis={{ showTooltip: true }} style={{ width: 120 }}>
            {document.title}
          </Text>
        )}
      />
    </>
  );

  return (
    <div className={styles.wrap}>
      <header>
        <Nav
          className={styles.headerOuterWrap}
          mode="horizontal"
          header={DocumentTitle}
          footer={
            <Space>
              {document && authority.readable && (
                <DocumentCollaboration
                  key="collaboration"
                  wikiId={document.wikiId}
                  documentId={documentId}
                />
              )}
              <DocumentShare key="share" documentId={documentId} />
              <DocumentStar key="star" documentId={documentId} />
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
            </Space>
          }
        />
      </header>
      <main className={styles.contentWrap}>
        <DataRender
          loading={docAuthLoading}
          loadingContent={
            <div style={{ margin: 24 }}>
              <Spin></Spin>
            </div>
          }
          error={null}
          normalContent={() => {
            return (
              // <div style={{ fontSize }}>
              <>
                <Seo title={document.title} />
                <Editor
                  key={document.id}
                  user={user}
                  documentId={document.id}
                  authority={authority}
                  className={editorWrapClassNames}
                  style={{ fontSize }}
                />
              </>
            );
          }}
        />
      </main>
    </div>
  );
};
