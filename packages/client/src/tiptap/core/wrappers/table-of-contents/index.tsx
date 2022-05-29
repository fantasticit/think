import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { useCallback, useEffect, useState } from 'react';

import styles from './index.module.scss';

const arrToTree = (tocs) => {
  const result = [];
  const levels = [result];

  tocs.forEach((o) => {
    let offset = -1;
    let parent = levels[o.level + offset];

    while (!parent) {
      offset -= 1;
      parent = levels[o.level + offset];
    }

    parent.push({ ...o, children: (levels[o.level] = []) });
  });

  return result;
};

export const TableOfContentsWrapper = ({ editor }) => {
  const isEditable = editor.isEditable;
  const [items, setItems] = useState([]);

  const handleUpdate = useCallback(() => {
    const headings = [];
    const transaction = editor.state.tr;

    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        const id = `heading-${headings.length + 1}`;

        if (node.attrs.id !== id) {
          transaction.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            id,
          });
        }

        headings.push({
          level: node.attrs.level,
          text: node.textContent,
          id,
        });
      }
    });

    transaction.setMeta('addToHistory', false);
    transaction.setMeta('preventUpdate', true);
    editor.view.dispatch(transaction);

    setItems(headings);
    editor.eventEmitter && editor.eventEmitter.emit('TableOfContents', arrToTree(headings));
  }, [editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (!editor.options.editable) {
      handleUpdate();
      return;
    }

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor, handleUpdate]);

  useEffect(() => {
    handleUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NodeViewWrapper className={cls(styles.toc, isEditable && styles.visible)}>
      {isEditable ? (
        <div style={{ position: 'relative' }}>
          <ul className={styles.list}>
            {items.map((item, index) => (
              <li key={index} className={styles.item} style={{ paddingLeft: `${item.level - 2}rem` }}>
                <a href={`#${item.id}`}>{item.text}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </NodeViewWrapper>
  );
};
