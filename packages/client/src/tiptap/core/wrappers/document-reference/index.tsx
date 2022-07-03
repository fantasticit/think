import cls from 'classnames';
import { IconDocument } from 'components/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { DragableWrapper } from 'tiptap/core/wrappers/dragable';

import styles from './index.module.scss';

export const DocumentReferenceWrapper = ({ editor, node, updateAttributes }) => {
  const { pathname } = useRouter();
  const isShare = pathname.includes('share');
  const isEditable = editor.isEditable;
  const { wikiId, documentId, title } = node.attrs;

  const content = useMemo(() => {
    if (!wikiId && !documentId) {
      return (
        <div className={cls(styles.empty, !isEditable && 'render-wrapper')}>
          <span>{'用户未选择文档'}</span>
        </div>
      );
    }

    if (isEditable) {
      return (
        <div className={cls(styles.itemWrap)}>
          <IconDocument />
          <span>{title}</span>
        </div>
      );
    }

    return (
      <Link
        key={documentId}
        href={{
          pathname: `${!isShare ? '' : '/share'}/wiki/[wikiId]/document/[documentId]`,
          query: { wikiId, documentId },
        }}
      >
        <a className={cls(styles.itemWrap, !isEditable && 'render-wrapper')} target="_blank">
          <IconDocument />
          <span>{title || '请选择文档'}</span>
        </a>
      </Link>
    );
  }, [wikiId, documentId, isEditable, isShare, title]);

  return (
    <DragableWrapper editor={editor} as="div" className={cls(styles.wrap, isEditable && 'render-wrapper')}>
      {content}
    </DragableWrapper>
  );
};
