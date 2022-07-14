import { Editor } from '@tiptap/core';
import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import React, { ElementType } from 'react';
import { useActive } from 'tiptap/core/hooks/use-active';

import styles from './index.module.scss';

export const DragableWrapper: React.FC<{
  editor: Editor;
  extensionName: string;
  as?: ElementType;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ editor, extensionName, as = 'div', id, className, style = {}, children }) => {
  const isEditable = editor.isEditable;
  const isActive = useActive(editor, extensionName);

  return (
    <NodeViewWrapper
      as={as}
      id={id}
      className={cls(styles.draggableItem, isEditable && styles.isEditable, isActive && styles.isActive, className)}
      style={style}
    >
      <div className={styles.dragHandle} contentEditable="false" draggable="true" data-drag-handle />
      <div className={styles.content}>{children}</div>
    </NodeViewWrapper>
  );
};
