import { IconDoubleChevronLeft, IconDoubleChevronRight } from '@douyinfe/semi-icons';
import { Anchor, Button } from '@douyinfe/semi-ui';
import { useDocumentStyle, Width } from 'hooks/use-document-style';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback, useEffect } from 'react';
import { TableOfContents } from 'tiptap/core/extensions/table-of-contents';
import { findNode } from 'tiptap/prose-utils';

import { Editor } from '../react';
import styles from './index.module.scss';

interface IToc {
  level: number;
  id: string;
  text: string;
}

const MAX_LEVEL = 6;

const Toc = ({ toc, collapsed }) => {
  return (
    <Anchor.Link
      href={`#${toc.id}`}
      title={
        collapsed ? (
          <div style={{ width: 8 * (MAX_LEVEL - toc.level + 1) }} className={styles.collapsedItem}></div>
        ) : (
          toc.text
        )
      }
    >
      {toc.children && toc.children.length
        ? toc.children.map((toc) => <Toc key={toc.text} toc={toc} collapsed={collapsed} />)
        : null}
    </Anchor.Link>
  );
};

export const Tocs: React.FC<{ tocs: Array<IToc>; editor: Editor }> = ({ tocs = [], editor }) => {
  const [hasToc, toggleHasToc] = useToggle(false);
  const [collapsed, toggleCollapsed] = useToggle(true);

  useDocumentStyle((width) => {
    if (width === Width.fullWidth) {
      toggleCollapsed(true);
    } else {
      toggleCollapsed(false);
    }
  });

  const getContainer = useCallback(() => {
    return document.querySelector(`#js-tocs-container`);
  }, []);

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
        <Anchor maxHeight={500} getContainer={getContainer} maxWidth={collapsed ? 56 : 180}>
          {tocs.length && tocs.map((toc) => <Toc key={toc.text} toc={toc} collapsed={collapsed} />)}
        </Anchor>
      </main>
    </div>
  );
};
