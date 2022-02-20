import Router from "next/router";
import React, { useCallback, useMemo } from "react";
import cls from "classnames";
import {
  Layout,
  Nav,
  Space,
  Button,
  Typography,
  Skeleton,
  Tooltip,
  Popover,
  BackTop,
} from "@douyinfe/semi-ui";
import { IconEdit, IconArticle } from "@douyinfe/semi-icons";
import { Seo } from "components/seo";
import { DataRender } from "components/data-render";
import { DocumentShare } from "components/document/share";
import { DocumentStar } from "components/document/star";
import { DocumentCollaboration } from "components/document/collaboration";
import { DocumentStyle } from "components/document/style";
import { CommentEditor } from "components/document/comments";
import { useDocumentStyle } from "hooks/useDocumentStyle";
import { useUser } from "data/user";
import { useDocumentDetail } from "data/document";
import { DocumentSkeleton } from "components/tiptap";
import { Editor } from "./editor";
import { CreateUser } from "./user";
import styles from "./index.module.scss";

const { Header } = Layout;
const { Text } = Typography;

interface IProps {
  documentId: string;
}

export const DocumentReader: React.FC<IProps> = ({ documentId }) => {
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

  const gotoEdit = useCallback(() => {
    Router.push(`/wiki/${document.wikiId}/document/${document.id}/edit`);
  }, [document]);

  return (
    <div className={styles.wrap}>
      <Header className={styles.headerWrap}>
        <Nav
          style={{ overflow: "auto", paddingLeft: 0, paddingRight: 0 }}
          mode="horizontal"
          header={
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
                <Text
                  strong
                  ellipsis={{ showTooltip: true }}
                  style={{ width: 120 }}
                >
                  {document.title}
                </Text>
              )}
            />
          }
          footer={
            <Space>
              {document && authority.readable && (
                <DocumentCollaboration
                  key="collaboration"
                  wikiId={document.wikiId}
                  documentId={documentId}
                />
              )}
              {authority && authority.editable && (
                <Tooltip key="edit" content="编辑" position="bottom">
                  <Button icon={<IconEdit />} onClick={gotoEdit} />
                </Tooltip>
              )}
              {authority && authority.readable && (
                <>
                  <DocumentShare key="share" documentId={documentId} />
                  <DocumentStar key="star" documentId={documentId} />
                </>
              )}
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
            </Space>
          }
        ></Nav>
      </Header>
      <Layout className={styles.contentWrap}>
        <div
          className={cls(styles.editorWrap, editorWrapClassNames)}
          style={{ fontSize }}
        >
          <DataRender
            loading={docAuthLoading}
            error={docAuthError}
            loadingContent={<DocumentSkeleton />}
            normalContent={() => {
              return (
                <>
                  <Seo title={document.title} />
                  <Editor
                    key={document.id}
                    user={user}
                    documentId={document.id}
                  />
                  <div style={{ marginBottom: 24 }}>
                    <CreateUser document={document} />
                  </div>
                  <div className={styles.commentWrap}>
                    <CommentEditor documentId={document.id} />
                  </div>
                  <BackTop
                    target={() => window.document.querySelector(".Pane2")}
                  />
                </>
              );
            }}
          />
        </div>
      </Layout>
    </div>
  );
};
