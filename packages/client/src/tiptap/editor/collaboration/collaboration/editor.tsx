import React, { useEffect, forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import { Toast, BackTop } from '@douyinfe/semi-ui';
import { HocuspocusProvider } from '@hocuspocus/provider';
import cls from 'classnames';
import { useNetwork } from 'hooks/use-network';
import { useToggle } from 'hooks/use-toggle';
import { useWindowSize } from 'hooks/use-window-size';
import { LogoName } from 'components/logo';
import { Banner } from 'components/banner';
import { Collaboration } from 'tiptap/core/extensions/collaboration';
import { CollaborationCursor } from 'tiptap/core/extensions/collaboration-cursor';
import { getRandomColor } from 'helpers/color';
import { isAndroid, isIOS } from 'helpers/env';
import { useEditor, EditorContent } from '../../react';
import { CollaborationKit } from '../kit';
import { MenuBar } from './menubar';
import { ICollaborationEditorProps, ProviderStatus } from './type';
import styles from './index.module.scss';

type IProps = Pick<
  ICollaborationEditorProps,
  'editable' | 'user' | 'onTitleUpdate' | 'menubar' | 'renderInEditorPortal'
> & {
  hocuspocusProvider: HocuspocusProvider;
  status: ProviderStatus;
};

function scrollEditor(editor) {
  try {
    /**
     * 修复移动端编辑问题
     */
    setTimeout(() => {
      try {
        const element = editor.options.element;
        // 脏代码：这里使用 parentElement 是和布局有关的，需要根据实际情况修改
        const parentElement = element.parentNode as HTMLElement;
        const nextScrollTop = element.scrollHeight;
        parentElement.scrollTop = nextScrollTop;
      } catch (e) {
        //
      }
    }, 0);
  } catch (e) {
    //
  }
}

export const EditorInstance = forwardRef((props: IProps, ref) => {
  const { hocuspocusProvider, editable, user, onTitleUpdate, status, menubar, renderInEditorPortal } = props;
  const $headerContainer = useRef<HTMLDivElement>();
  const $mainContainer = useRef<HTMLDivElement>();
  const { isMobile } = useWindowSize();
  const { online } = useNetwork();
  const [created, toggleCreated] = useToggle(false);
  const editor = useEditor(
    {
      editable,
      extensions: [
        ...CollaborationKit,
        Collaboration.configure({
          document: hocuspocusProvider.document,
        }),
        CollaborationCursor.configure({
          provider: hocuspocusProvider,
          user: {
            ...(user || {
              name: '匿名用户正在阅读文章...',
            }),
            color: getRandomColor(),
          },
        }),
      ].filter(Boolean),
      onTransaction({ transaction }) {
        try {
          const title = transaction.doc.content.firstChild.content.firstChild.textContent;
          onTitleUpdate(title);
        } catch (e) {
          //
        }

        if (editable) {
          scrollEditor(this);
        }
      },
      onCreate() {
        toggleCreated(true);

        if (editable) {
          scrollEditor(this);
        }
      },
      onDestroy() {},
    },
    [editable, user, onTitleUpdate, hocuspocusProvider]
  );

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
  }, []);

  return (
    <>
      {(!online || status === 'disconnected') && (
        <Banner
          type="warning"
          description="我们已与您断开连接，您可以继续编辑文档。一旦重新连接，我们会自动重新提交数据。"
        />
      )}
      {/* FIXME：需要菜单栏但是无法编辑，则认为进入了编辑模式但是没有编辑权限 */}
      {!editable && menubar && (
        <Banner type="warning" description="您没有编辑权限，暂不能编辑该文档。" closeable={false} />
      )}
      {menubar && (
        <header className={cls(isMobile && styles.mobileToolbar)} ref={$headerContainer}>
          <MenuBar editor={editor} />
        </header>
      )}
      <main ref={$mainContainer}>
        <EditorContent editor={editor} />
        {protals}
      </main>

      {editable && menubar && (
        <BackTop target={() => $mainContainer.current} style={{ right: 16, bottom: 65 }} visibilityHeight={200} />
      )}
    </>
  );
});

EditorInstance.displayName = 'EditorInstance';
