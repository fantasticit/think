import { NodeViewContent } from '@tiptap/react';
import { useCallback } from 'react';
import { DragableWrapper } from 'tiptap/core/wrappers/dragable';

import styles from './index.module.scss';

export const ParagraphWrapper = ({ editor }) => {
  const prevent = useCallback((e) => {
    e.prevntDefault();
    return false;
  }, []);

  return (
    <DragableWrapper editor={editor} className={styles.paragraph}>
      <NodeViewContent draggable="false" onDragStart={prevent} />
    </DragableWrapper>
  );
};
