import { IconChevronLeft } from '@douyinfe/semi-icons';
import { Button, Nav, Popconfirm, Space, Switch, Tooltip, Typography } from '@douyinfe/semi-ui';
import { ILoginUser, ITemplate } from '@think/domains';
import cls from 'classnames';
import { DocumentStyle } from 'components/document/style';
import { Theme } from 'components/theme';
import { User } from 'components/user';
import { useDocumentStyle } from 'hooks/use-document-style';
import { useWindowSize } from 'hooks/use-window-size';
import Router from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CollaborationEditor } from 'tiptap/editor';

import styles from './index.module.scss';

const { Text } = Typography;

interface IProps {
  user: ILoginUser;
  data: ITemplate;
  updateTemplate: (arg) => Promise<ITemplate>;
  deleteTemplate: () => Promise<void>;
}

export const Editor: React.FC<IProps> = ({ user, data, updateTemplate, deleteTemplate }) => {
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
              <DocumentStyle />
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
            <CollaborationEditor menubar editable user={user} id={data.id} type="template" onTitleUpdate={setTitle} />
          </div>
        </div>
      </main>
    </div>
  );
};
