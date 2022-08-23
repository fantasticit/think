import { BackTop, Toast } from '@douyinfe/semi-ui';
import { HocuspocusProvider } from '@hocuspocus/provider';
import cls from 'classnames';
import { Banner } from 'components/banner';
import { CommentEditor } from 'components/document/comments';
import { ImageViewer } from 'components/image-viewer';
import { LogoName } from 'components/logo';
import { getRandomColor } from 'helpers/color';
import { isAndroid, isIOS } from 'helpers/env';
import { useDocumentStyle } from 'hooks/use-document-style';
import { useNetwork } from 'hooks/use-network';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { useToggle } from 'hooks/use-toggle';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor } from 'tiptap/core';
import { Collaboration } from 'tiptap/core/extensions/collaboration';
import { CollaborationCursor } from 'tiptap/core/extensions/collaboration-cursor';
import { Tocs } from 'tiptap/editor/tocs';

import { CollaborationKit } from '../kit';
import styles from './index.module.scss';
import { MenuBar } from './menubar';
import { ICollaborationEditorProps, ProviderStatus } from './type';

type IProps = Pick<
  ICollaborationEditorProps,
  'editable' | 'user' | 'onTitleUpdate' | 'menubar' | 'renderInEditorPortal' | 'hideComment'
> & {
  hocuspocusProvider: HocuspocusProvider;
  status: ProviderStatus;
  documentId: string;
};

export const EditorInstance = forwardRef((props: IProps, ref) => {
  const {
    hocuspocusProvider,
    documentId,
    editable,
    user,
    hideComment,
    status,
    menubar,
    renderInEditorPortal,
    onTitleUpdate,
  } = props;
  const $headerContainer = useRef<HTMLDivElement>();
  const $mainContainer = useRef<HTMLDivElement>();
  const { isMobile } = IsOnMobile.useHook();
  const { online } = useNetwork();
  const [created, toggleCreated] = useToggle(false);
  const editor = useEditor(
    {
      editable,
      editorProps: {
        // @ts-ignore
        taskItemClickable: true,
        attributes: {
          class: 'is-withauthor',
        },
      },
      extensions: [
        ...CollaborationKit,
        Collaboration.configure({
          document: hocuspocusProvider.document,
        }),
        CollaborationCursor.configure({
          provider: hocuspocusProvider,
          user: {
            ...(user || {
              name: '访客',
            }),
            color: getRandomColor(),
          },
        }),
      ].filter(Boolean),
      onUpdate({ transaction }) {
        try {
          const title = transaction.doc.content.firstChild.content.firstChild?.textContent;
          onTitleUpdate(title || '未命名文档');
        } catch (e) {
          //
        }
      },
      onCreate() {
        toggleCreated(true);
      },
      onDestroy() {},
    },
    [editable, user, onTitleUpdate, hocuspocusProvider]
  );
  const { width, fontSize } = useDocumentStyle();
  const editorWrapClassNames = useMemo(() => {
    return width === 'standardWidth' ? styles.isStandardWidth : styles.isFullWidth;
  }, [width]);
  const getTocsContainer = useCallback(() => $mainContainer.current, []);

  useImperativeHandle(ref, () => editor);

  const protals = useMemo(() => {
    if (!created || !renderInEditorPortal) return;
    return renderInEditorPortal($mainContainer.current);
  }, [created, renderInEditorPortal]);

  // 监听 ctrl+s
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

  // 监听键盘收起、打开
  useEffect(() => {
    if (!isMobile) return;

    let cleanUp = () => {};
    const focusIn = () => {
      setTimeout(() => {
        if (!$headerContainer.current) return;
        $headerContainer.current.classList.add(styles.keyUp);
        $headerContainer.current.scrollIntoView();
      }, 200);
    };
    const focusOut = () => {
      if (!$headerContainer.current) return;
      $headerContainer.current.classList.remove(styles.iOSKeyUp);
    };

    if (isIOS()) {
      document.body.addEventListener('focusin', focusIn);
      document.body.addEventListener('focusout', focusOut);
      cleanUp = () => {
        document.body.removeEventListener('focusin', focusIn);
        document.body.removeEventListener('focusout', focusOut);
      };
    } else if (isAndroid) {
      const originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
      window.onresize = function () {
        //键盘弹起与隐藏都会引起窗口的高度发生变化
        const resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
        if (resizeHeight < originalHeight) {
          focusIn();
        } else {
          focusOut();
        }
      };
    }

    return () => {
      cleanUp();
    };
  }, [isMobile]);

  return (
    <>
      {(!online || status === 'disconnected') && (
        <Banner
          type="warning"
          description={
            editable
              ? '我们已与您断开连接，您可以继续编辑文档。一旦重新连接，我们会自动重新提交数据。'
              : '我们已与您断开连接，您可以继续阅读文档。一旦重新连接，我们会自动重新刷新数据。'
          }
        />
      )}

      {/* FIXME：需要菜单栏但是无法编辑，则认为进入了编辑模式但是没有编辑权限，也许有更好的判断 */}
      {!editable && menubar && (
        <Banner type="warning" description="您没有编辑权限，暂不能编辑该文档。" closeable={false} />
      )}

      {menubar && (
        <header className={cls(isMobile && styles.mobileToolbar)} ref={$headerContainer}>
          <MenuBar editor={editor} />
        </header>
      )}

      <main
        ref={$mainContainer}
        id={'js-tocs-container'}
        style={{
          padding: isMobile ? `0 24px 50px` : `0 6rem 50px`,
        }}
      >
        <div className={cls(styles.contentWrap, editorWrapClassNames)}>
          <div style={{ fontSize, paddingBottom: editable ? 96 : 24 }}>
            <EditorContent editor={editor} />
          </div>
          {!editable && !hideComment && (
            <div className={styles.commentWrap}>
              <CommentEditor documentId={documentId} />
            </div>
          )}
        </div>
        {!isMobile && (
          <div className={styles.tocsWrap}>
            <Tocs editor={editor} getContainer={getTocsContainer} />
          </div>
        )}
        {protals}
        {!editable && <ImageViewer container={$mainContainer.current} />}
      </main>
      <BackTop
        target={() => $mainContainer.current}
        style={{ right: isMobile ? 16 : 36, bottom: 65 }}
        visibilityHeight={200}
      />
    </>
  );
});

EditorInstance.displayName = 'EditorInstance';
