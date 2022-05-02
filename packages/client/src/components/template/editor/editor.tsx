import React, { useMemo, useCallback, useState, useEffect } from 'react';
import Router from 'next/router';
import cls from 'classnames';
import {
  Button,
  Nav,
  Space,
  Typography,
  Tooltip,
  Switch,
  Popover,
  Popconfirm,
  BackTop,
  Toast,
} from '@douyinfe/semi-ui';
import { IconChevronLeft, IconArticle } from '@douyinfe/semi-icons';
import { ILoginUser, ITemplate } from '@think/domains';
import { Theme } from 'components/theme';
import {
  useEditor,
  EditorContent,
  BaseKit,
  DocumentWithTitle,
  getCollaborationExtension,
  getProvider,
  MenuBar,
} from 'tiptap';
import { User } from 'components/user';
import { DocumentStyle } from 'components/document/style';
import { LogoName } from 'components/logo';
import { useDocumentStyle } from 'hooks/use-document-style';
import { useWindowSize } from 'hooks/use-window-size';
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
  const provider = useMemo(() => {
    return getProvider({
      targetId: data.id,
      token: user.token,
      cacheType: 'READER',
      user,
      docType: 'template',
    });
  }, []);
  const editor = useEditor(
    {
      editable: true,
      extensions: [...BaseKit, DocumentWithTitle, getCollaborationExtension(provider)],
      onTransaction: ({ transaction }) => {
        try {
          const title = transaction.doc.content.firstChild.content.firstChild.textContent;
          setTitle(title);
        } catch (e) {
          //
        }
      },
    },
    [provider]
  );
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

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.keyCode == 83) {
        event.preventDefault();
        Toast.info(`${LogoName}会实时保存你的数据，无需手动保存。`);
        return false;
      }
    };

    window.document.addEventListener('keydown', listener);

    return () => {
      window.document.removeEventListener('keydown', listener);
    };
  }, []);

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
          <header className={editorWrapClassNames}>
            <div>
              <MenuBar editor={editor} />
            </div>
          </header>
          <main id="js-template-editor-container">
            <div className={cls(styles.contentWrap, editorWrapClassNames)} style={{ fontSize }}>
              <EditorContent editor={editor} />
            </div>
            <BackTop target={() => document.querySelector('#js-template-editor-container')} />
          </main>
        </div>
      </main>
    </div>
  );
};
