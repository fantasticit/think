import React, { useMemo, useCallback, useState, useEffect } from "react";
import Router from "next/router";
import cls from "classnames";
import { useEditor, EditorContent } from "@tiptap/react";
import {
  Button,
  Nav,
  Space,
  Skeleton,
  Typography,
  Tooltip,
  Spin,
  Switch,
  Popover,
  Popconfirm,
  BackTop,
} from "@douyinfe/semi-ui";
import { IconChevronLeft, IconArticle } from "@douyinfe/semi-icons";
import { IUser, ITemplate } from "@think/share";
import { Theme } from "components/theme";
import {
  DEFAULT_EXTENSION,
  DocumentWithTitle,
  getCollaborationExtension,
  getProvider,
  MenuBar,
  Toc,
} from "components/tiptap";
import { DataRender } from "components/data-render";
import { User } from "components/user";
import { DocumentStyle } from "components/document/style";
import { useDocumentStyle } from "hooks/useDocumentStyle";
import { safeJSONParse } from "helpers/json";
import styles from "./index.module.scss";

const { Text } = Typography;

interface IProps {
  user: IUser;
  data: ITemplate;
  loading: boolean;
  error: Error | null;
  updateTemplate: (arg) => Promise<ITemplate>;
  deleteTemplate: () => Promise<void>;
}

export const Editor: React.FC<IProps> = ({
  user,
  data,
  loading,
  error,
  updateTemplate,
  deleteTemplate,
}) => {
  if (!user) return null;

  const provider = useMemo(() => {
    return getProvider({
      targetId: data.id,
      token: user.token,
      cacheType: "READER",
      user,
      docType: "template",
    });
  }, [data, user.token]);
  const editor = useEditor({
    editable: true,
    extensions: [
      ...DEFAULT_EXTENSION,
      DocumentWithTitle,
      getCollaborationExtension(provider),
    ],
    content: safeJSONParse(data && data.content),
  });

  const [isPublic, setPublic] = useState(false);
  const { width, fontSize } = useDocumentStyle();
  const editorWrapClassNames = useMemo(() => {
    return width === "standardWidth"
      ? styles.isStandardWidth
      : styles.isFullWidth;
  }, [width]);

  const goback = useCallback(() => {
    Router.back();
  }, []);

  const handleDelte = useCallback(() => {
    deleteTemplate().then(() => {
      goback();
    });
  }, [deleteTemplate]);

  useEffect(() => {
    if (!data) return;
    setPublic(data.isPublic);
  }, [data]);

  return (
    <div className={styles.wrap}>
      <header>
        <Nav
          style={{ overflow: "auto" }}
          mode="horizontal"
          header={
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
                <>
                  <Tooltip content="返回" position="bottom">
                    <Button
                      onClick={goback}
                      icon={<IconChevronLeft />}
                      style={{ marginRight: 16 }}
                    />
                  </Tooltip>
                  <Text
                    strong
                    ellipsis={{ showTooltip: true }}
                    style={{ width: 120 }}
                  >
                    {data.title}
                  </Text>
                </>
              )}
            />
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
              <Tooltip
                position="bottom"
                content={isPublic ? "公开模板" : "个人模板"}
              >
                <Switch
                  onChange={(v) => updateTemplate({ isPublic: v })}
                ></Switch>
              </Tooltip>
              <Popconfirm
                title="删除模板"
                content="模板删除后不可恢复，谨慎操作！"
                onConfirm={handleDelte}
              >
                <Button type="danger">删除</Button>
              </Popconfirm>
              <Theme />
              <User />
            </Space>
          }
        ></Nav>
      </header>
      <main className={styles.contentWrap}>
        <DataRender
          loading={false}
          loadingContent={
            <div style={{ margin: 24 }}>
              <Spin></Spin>
            </div>
          }
          error={error}
          normalContent={() => {
            return (
              <div className={styles.editorWrap}>
                <header className={editorWrapClassNames}>
                  <div>
                    <MenuBar editor={editor} />
                  </div>
                </header>
                <main id="js-template-editor-container">
                  <div
                    className={cls(styles.contentWrap, editorWrapClassNames)}
                    style={{ fontSize }}
                  >
                    <EditorContent editor={editor} />
                  </div>
                  <BackTop
                    target={() =>
                      document.querySelector("#js-template-editor-container")
                    }
                  />
                </main>
              </div>
            );
          }}
        />
      </main>
    </div>
  );
};
