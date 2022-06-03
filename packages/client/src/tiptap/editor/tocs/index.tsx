import { Anchor, Tooltip } from '@douyinfe/semi-ui';
import cls from 'classnames';
import { throttle } from 'helpers/throttle';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { Editor } from 'tiptap/core';
import { TableOfContents } from 'tiptap/core/extensions/table-of-contents';
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

const TOCS_WIDTH = 156 + 16 * 2; // 目录展开的宽度

export const Tocs: React.FC<{ editor: Editor; getContainer: () => HTMLElement }> = ({ editor, getContainer }) => {
  const $container = useRef<HTMLDivElement>();
  const [collapsed, toggleCollapsed] = useToggle(true);
  const [headings, setHeadings] = useState<IHeading[]>([]);
  const [nestedHeadings, setNestedHeadings] = useState<IHeading[]>([]);

  useEffect(() => {
    const el = getContainer();

    if (!el) return;

    const handler = throttle(() => {
      const diffWidth = (el.offsetWidth - (el.firstChild as HTMLDivElement).offsetWidth) / 2;
      toggleCollapsed(diffWidth <= TOCS_WIDTH);
    }, 200);

    handler();
    const observer = new MutationObserver(handler);
    observer.observe(el, { attributes: true, childList: true, subtree: true });
    const resizeObserver = new ResizeObserver(handler);
    resizeObserver.observe(el);
    window.addEventListener('resize', handler);

    const scrollHandler = throttle(() => {
      const container = $container.current;
      if (!container) return;

      let target = container.querySelector('.semi-anchor-link-title-active');
      if (!target) {
        target = container.querySelector('.semi-anchor-link-title:first-of-type');
      }
      if (!target) return;
      scrollIntoView(target, { scrollMode: 'if-needed' });
    }, 100);

    el.addEventListener('scroll', scrollHandler);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', handler);

      el.removeEventListener('scroll', scrollHandler);
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
    <div className={cls(styles.wrapper, 'hidden-scrollbar ')} ref={$container}>
      <Anchor
        railTheme={collapsed ? 'muted' : 'tertiary'}
        maxHeight={'calc(100vh - 360px)'}
        getContainer={getContainer}
        style={{
          width: collapsed ? 56 : 156,
          overflow: 'auto',
        }}
        scrollMotion
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
