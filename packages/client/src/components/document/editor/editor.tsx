import { IAuthority, ILoginUser } from '@think/domains';
import cls from 'classnames';
import { event, triggerChangeDocumentTitle, triggerJoinUser, USE_DOCUMENT_VERSION } from 'event';
import { useMount } from 'hooks/use-mount';
import React, { useEffect, useRef } from 'react';
import { CollaborationEditor, ICollaborationRefProps } from 'tiptap/editor';

import styles from './index.module.scss';

interface IProps {
  user: ILoginUser;
  documentId: string;
  authority: IAuthority;
}

export const Editor: React.FC<IProps> = ({ user: currentUser, documentId, authority }) => {
  const $editor = useRef<ICollaborationRefProps>();
  const mounted = useMount();

  useEffect(() => {
    const handler = (data) => {
      const editor = $editor.current && $editor.current.getEditor();
      if (!editor) return;
      editor.commands.setContent(data);
    };

    event.on(USE_DOCUMENT_VERSION, handler);

    return () => {
      event.off(USE_DOCUMENT_VERSION, handler);
    };
  }, []);

  return (
    <div className={cls(styles.editorWrap)}>
      {mounted && (
        <CollaborationEditor
          ref={$editor}
          menubar
          editable={authority && authority.editable}
          user={currentUser}
          id={documentId}
          type="document"
          onTitleUpdate={triggerChangeDocumentTitle}
          onAwarenessUpdate={triggerJoinUser}
        />
      )}
    </div>
  );
};
