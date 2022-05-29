import { IconDoubleChevronLeft, IconDoubleChevronRight } from '@douyinfe/semi-icons';
import { Anchor, Button, Tooltip } from '@douyinfe/semi-ui';
import { Editor } from '@tiptap/core';
import { throttle } from 'helpers/throttle';
import { flattenTree2Array } from 'helpers/tree';
import { useDocumentStyle, Width } from 'hooks/use-document-style';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback, useEffect } from 'react';
import { TableOfContents } from 'tiptap/core/extensions/table-of-contents';
import { findNode } from 'tiptap/prose-utils';

import styles from './index.module.scss';

interface IToc {
  level: number;
  id: string;
  text: string;
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

const FULL_WIDTH = 1200;

export const Tocs: React.FC<{ tocs: Array<IToc>; editor: Editor }> = ({ tocs = [], editor }) => {
  const [hasToc, toggleHasToc] = useToggle(false);
  const [collapsed, toggleCollapsed] = useToggle(true);
  const { width } = useDocumentStyle();

  const getContainer = useCallback(() => {
    return document.querySelector(`#js-tocs-container`);
  }, []);

  useEffect(() => {
    if (width === Width.fullWidth) {
      toggleCollapsed(true);
    } else {
      toggleCollapsed(false);
    }
  }, [width, toggleCollapsed]);

  useEffect(() => {
    const listener = () => {
      const nodes = findNode(editor, TableOfContents.name);
      const hasTocNow = !!(nodes && nodes.length);
      if (hasTocNow !== hasToc) {
        toggleHasToc(hasTocNow);
      }
    };

    editor.on('transaction', listener);

    return () => {
      editor.off('transaction', listener);
    };
  }, [editor, hasToc, toggleHasToc]);

  useEffect(() => {
    const el = document.querySelector(`#js-tocs-container`) as HTMLDivElement;
    const handler = throttle(() => {
      toggleCollapsed(el.offsetWidth <= FULL_WIDTH);
    }, 200);

    handler();

    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
    };
  }, [toggleCollapsed]);

  return (
    <div className={styles.wrapper} style={{ display: hasToc ? 'block' : 'none' }}>
      <header>
        <Button
          type="tertiary"
          theme="borderless"
          icon={!collapsed ? <IconDoubleChevronRight /> : <IconDoubleChevronLeft />}
          onClick={toggleCollapsed}
        ></Button>
      </header>
      <main>
        {collapsed ? (
          <div
            className={styles.dotWrap}
            style={{
              maxHeight: 'calc(100vh - 360px)',
            }}
          >
            {flattenTree2Array(tocs).map((toc) => {
              return (
                <Tooltip key={toc.text} content={toc.text} position="right">
                  <div className={styles.dot}></div>
                </Tooltip>
              );
            })}
          </div>
        ) : (
          <Anchor
            railTheme={collapsed ? 'muted' : 'tertiary'}
            maxHeight={'calc(100vh - 360px)'}
            getContainer={getContainer}
            maxWidth={collapsed ? 56 : 180}
          >
            {tocs.length && tocs.map((toc) => <Toc key={toc.text} toc={toc} collapsed={collapsed} />)}
          </Anchor>
        )}
      </main>
    </div>
  );
};
