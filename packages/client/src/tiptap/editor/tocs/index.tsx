import { Anchor, Tooltip } from '@douyinfe/semi-ui';
import { throttle } from 'helpers/throttle';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback, useEffect, useState } from 'react';
import { TableOfContents } from 'tiptap/core/extensions/table-of-contents';
import { Editor } from 'tiptap/editor/react';
import { findNode } from 'tiptap/prose-utils';

import styles from './index.module.scss';
import { flattenHeadingsToTree } from './util';

interface IHeading {
  level: number;
  id: string;
  text: string;
  children?: IHeading[];
}

const Toc = ({ toc, collapsed }) => {
  return (
    <Anchor.Link
      href={`#${toc.id}`}
      title={
        collapsed ? (
          <Tooltip content={toc.text} position="right">
            <div className={styles.collapsedItem}></div>
          </Tooltip>
        ) : (
          toc.text
        )
      }
      style={{ paddingLeft: collapsed ? 16 : 8 }}
    >
      {toc.children && toc.children.length
        ? toc.children.map((toc) => <Toc key={toc.text} toc={toc} collapsed={collapsed} />)
        : null}
    </Anchor.Link>
  );
};

const TOCS_WIDTH = 198; // 目录展开的宽度

export const Tocs: React.FC<{ editor: Editor; getContainer: () => HTMLElement }> = ({ editor, getContainer }) => {
  const [collapsed, toggleCollapsed] = useToggle(true);
  const [headings, setHeadings] = useState<IHeading[]>([]);
  const [nestedHeadings, setNestedHeadings] = useState<IHeading[]>([]);

  useEffect(() => {
    const el = getContainer();

    if (!el) return;

    const handler = throttle(() => {
      const diffWidth = el.offsetWidth - (el.firstChild as HTMLDivElement).offsetWidth;
      toggleCollapsed(diffWidth <= TOCS_WIDTH);
    }, 200);

    handler();
    const observer = new MutationObserver(handler);
    observer.observe(el, { attributes: true, childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [getContainer, toggleCollapsed]);

  const getTocs = useCallback(() => {
    if (!editor) return;
    const nodes = findNode(editor, TableOfContents.name);
    if (!nodes || !nodes.length) {
      setHeadings([]);
      setNestedHeadings([]);
      return;
    }

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

    setHeadings(headings);
    setNestedHeadings(flattenHeadingsToTree(headings));
  }, [editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.on('update', getTocs);

    return () => {
      editor.off('update', getTocs);
    };
  }, [editor, getTocs]);

  useEffect(() => {
    getTocs();
  }, [getTocs]);

  if (!headings || !headings.length) return null;

  return (
    <div className={styles.wrapper}>
      <Anchor
        railTheme={collapsed ? 'muted' : 'tertiary'}
        maxHeight={'calc(100vh - 360px)'}
        getContainer={getContainer}
        maxWidth={collapsed ? 56 : 150}
      >
        {collapsed
          ? headings.map((toc) => {
              return (
                <Anchor.Link
                  key={toc.text}
                  href={`#${toc.id}`}
                  title={
                    <Tooltip key={toc.text} content={toc.text} position="right">
                      <span className={styles.dot}>●</span>
                    </Tooltip>
                  }
                />
              );
            })
          : nestedHeadings.map((toc) => <Toc key={toc.text} toc={toc} collapsed={collapsed} />)}
      </Anchor>
    </div>
  );
};
