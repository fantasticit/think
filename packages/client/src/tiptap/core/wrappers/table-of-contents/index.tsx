import { NodeViewWrapper } from '@tiptap/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Collapsible, Button } from '@douyinfe/semi-ui';
import styles from './index.module.scss';
import { useToggle } from 'hooks/use-toggle';

export const TableOfContentsWrapper = ({ editor }) => {
  const [items, setItems] = useState([]);
  const [visible, toggleVisible] = useToggle(true);

  const maskStyle = useMemo(
    () =>
      visible
        ? {}
        : {
            WebkitMaskImage:
              'linear-gradient(to bottom, black 0%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0.2) 80%, transparent 100%)',
          },
    [visible]
  );

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
  }, [editor]);

  useEffect(handleUpdate, [handleUpdate]);

  useEffect(() => {
    if (!editor) {
      return null;
    }

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor, handleUpdate]);

  return (
    <NodeViewWrapper className={styles.toc}>
      <div style={{ position: 'relative' }}>
        <Collapsible isOpen={visible} collapseHeight={60} style={{ ...maskStyle }}>
          <ul className={styles.list}>
            {items.map((item, index) => (
              <li key={index} className={styles.item} style={{ paddingLeft: `${item.level - 2}rem` }}>
                <a href={`#${item.id}`}>{item.text}</a>
              </li>
            ))}
          </ul>
        </Collapsible>
        <Button theme="light" type="tertiary" size="small" onClick={toggleVisible}>
          {visible ? '收起' : '展开'}
        </Button>
      </div>
    </NodeViewWrapper>
  );
};
