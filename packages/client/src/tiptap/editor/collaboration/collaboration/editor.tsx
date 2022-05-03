import React, { useEffect, forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import { Toast, BackTop } from '@douyinfe/semi-ui';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { debounce } from 'helpers/debounce';
import { useNetwork } from 'hooks/use-network';
import { useToggle } from 'hooks/use-toggle';
import { LogoName } from 'components/logo';
import { Banner } from 'components/banner';
import { useEditor, EditorContent } from '../../react';
import { Collaboration } from 'tiptap/core/extensions/collaboration';
import { CollaborationCursor } from 'tiptap/core/extensions/collaboration-cursor';
import { getRandomColor } from 'helpers/color';
import { CollaborationKit } from '../kit';
import { MenuBar } from './menubar';
import { ICollaborationEditorProps, ProviderStatus } from './type';

type IProps = Pick<
  ICollaborationEditorProps,
  'editable' | 'user' | 'onTitleUpdate' | 'menubar' | 'renderInEditorPortal'
> & {
  hocuspocusProvider: HocuspocusProvider;
  status: ProviderStatus;
};

export const EditorInstance = forwardRef((props: IProps, ref) => {
  const { hocuspocusProvider, editable, user, onTitleUpdate, status, menubar, renderInEditorPortal } = props;
  const $mainContainer = useRef<HTMLDivElement>();
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
      onTransaction: debounce(({ transaction }) => {
        try {
          const title = transaction.doc.content.firstChild.content.firstChild.textContent;
          onTitleUpdate(title);
        } catch (e) {
          //
        }
      }, 50),
      onCreate() {
        toggleCreated(true);
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
        <header>
          <MenuBar editor={editor} />
        </header>
      )}
      <main ref={$mainContainer}>
        <EditorContent editor={editor} />
        {protals}
      </main>

      {editable && menubar && <BackTop target={() => $mainContainer.current} visibilityHeight={200} />}
    </>
  );
});

EditorInstance.displayName = 'EditorInstance';
