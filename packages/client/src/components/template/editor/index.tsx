import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Router from 'next/router';
import cls from 'classnames';
import { Spin, Button, Nav, Space, Typography, Tooltip, Switch, Popover, Popconfirm } from '@douyinfe/semi-ui';
import { IconChevronLeft, IconArticle } from '@douyinfe/semi-icons';
import { useUser } from 'data/user';
import { useTemplate } from 'data/template';
import { Seo } from 'components/seo';
import { DataRender } from 'components/data-render';
import { Theme } from 'components/theme';
import { User } from 'components/user';
import { DocumentStyle } from 'components/document/style';
import { useDocumentStyle } from 'hooks/use-document-style';
import { useWindowSize } from 'hooks/use-window-size';
import { CollaborationEditor } from 'tiptap/editor';
import styles from './index.module.scss';

interface IProps {
  templateId: string;
}

const { Text } = Typography;

export const TemplateEditor: React.FC<IProps> = ({ templateId }) => {
  const { user } = useUser();
  const { data, loading, error, updateTemplate, deleteTemplate } = useTemplate(templateId);

  const { width: windowWidth } = useWindowSize();
  const [title, setTitle] = useState(data.title);
  const [isPublic, setPublic] = useState(false);
  const { width, fontSize } = useDocumentStyle();
  const editorWrapClassNames = useMemo(() => {
    return width === 'standardWidth' ? styles.isStandardWidth : styles.isFullWidth;
  }, [width]);

  const goback = useCallback(() => {
    Router.back();
  }, []);

  const handleDelte = useCallback(() => {
    deleteTemplate().then(() => {
      goback();
    });
  }, [deleteTemplate, goback]);

  useEffect(() => {
    if (!data) return;
    setPublic(data.isPublic);
  }, [data]);

  return (
    <DataRender
      loading={loading}
      loadingContent={
        <div style={{ margin: 24 }}>
          <Spin></Spin>
        </div>
      }
      error={error}
      normalContent={() => {
        return (
          <>
            <Seo title={data.title} />
            <div className={styles.wrap}>
              <header>
                <Nav
                  style={{ overflow: 'auto' }}
                  mode="horizontal"
                  header={
                    <>
                      <Tooltip content="返回" position="bottom">
                        <Button onClick={goback} icon={<IconChevronLeft />} style={{ marginRight: 16 }} />
                      </Tooltip>
                      <Text strong ellipsis={{ showTooltip: true }} style={{ width: ~~(windowWidth / 4) }}>
                        {title}
                      </Text>
                    </>
                  }
                  footer={
                    <Space>
                      <Popover key="style" zIndex={1061} position="bottomLeft" content={<DocumentStyle />}>
                        <Button icon={<IconArticle />} theme="borderless" type="tertiary" />
                      </Popover>
                      <Tooltip position="bottom" content={isPublic ? '公开模板' : '个人模板'}>
                        <Switch onChange={(v) => updateTemplate({ isPublic: v })}></Switch>
                      </Tooltip>
                      <Popconfirm title="删除模板" content="模板删除后不可恢复，谨慎操作！" onConfirm={handleDelte}>
                        <Button type="danger">删除</Button>
                      </Popconfirm>
                      <Theme />
                      <User />
                    </Space>
                  }
                ></Nav>
              </header>
              <main className={styles.contentWrap}>
                <div className={styles.editorWrap}>
                  <div className={cls(styles.contentWrap, editorWrapClassNames)} style={{ fontSize }}>
                    <CollaborationEditor
                      menubar
                      editable
                      user={user}
                      id={data.id}
                      type="template"
                      onTitleUpdate={setTitle}
                    />
                  </div>
                </div>
              </main>
            </div>
          </>
        );
      }}
    />
  );
};
