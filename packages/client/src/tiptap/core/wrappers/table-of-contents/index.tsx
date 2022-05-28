import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { useCallback, useEffect, useState } from 'react';

import styles from './index.module.scss';

const arrToTree = (tocs) => {
  const levels = [{ children: [] }];
  tocs.forEach(function (o) {
    levels.length = o.level;
    levels[o.level - 1].children = levels[o.level - 1].children || [];
    levels[o.level - 1].children.push(o);
    levels[o.level] = o;
  });
  return levels[0].children;
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
    editor.eventEmitter.emit('TableOfContents', arrToTree(headings));
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
