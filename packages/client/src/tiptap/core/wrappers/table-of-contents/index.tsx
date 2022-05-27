import { Button, Collapsible } from '@douyinfe/semi-ui';
import { NodeViewWrapper } from '@tiptap/react';
import { useToggle } from 'hooks/use-toggle';
import { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './index.module.scss';

const arrToTree = (tocs) => {
  const data = [...tocs, { level: Infinity }];
  const res = [];

  const makeChildren = (item, flattenChildren) => {
    if (!flattenChildren.length) return;

    const stopAt = flattenChildren.findIndex((d) => d.level !== item.level + 1);

    if (stopAt > -1) {
      const children = flattenChildren.slice(0, stopAt);
      item.children = children;

      const remain = flattenChildren.slice(stopAt + 1);

      if (remain.length) {
        makeChildren(children[children.length - 1], remain);
      }
    } else {
      item.children = flattenChildren;
    }
  };

  let i = 0;

  while (i < data.length) {
    const item = data[i];
    const stopAt = data.slice(i + 1).findIndex((d) => d.level !== item.level + 1);

    if (stopAt > -1) {
      makeChildren(item, data.slice(i + 1).slice(0, stopAt));
      i += 1 + stopAt;
    } else {
      i += 1;
    }

    res.push(item);
  }

  return res.slice(0, -1);
};

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

    return headings;
  }, [editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (!editor.options.editable) {
      editor.eventEmitter.emit('TableOfContents', arrToTree(handleUpdate()));
      return;
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
