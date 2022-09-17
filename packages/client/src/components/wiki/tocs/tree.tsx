import { IconPlus } from '@douyinfe/semi-icons';
import { Button, Tree as SemiTree, Typography } from '@douyinfe/semi-ui';
import { DocumentActions } from 'components/document/actions';
import { DocumentCreator as DocumenCreatorForm } from 'components/document/create';
import deepEqual from 'deep-equal';
import { CREATE_DOCUMENT, event, triggerCreateDocument } from 'event';
import { useToggle } from 'hooks/use-toggle';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';

import styles from './index.module.scss';
import { findParents } from './utils';

const Actions = ({ node }) => {
  const createDocument = useCallback(
    (e) => {
      e.stopPropagation();
      triggerCreateDocument({ wikiId: node.wikiId, documentId: node.id });
    },
    [node.wikiId, node.id]
  );

  return (
    <span className={styles.right}>
      <DocumentActions
        key={node.id}
        hoverVisible
        organizationId={node.organizationId}
        wikiId={node.wikiId}
        documentId={node.id}
        size="small"
        hideDocumentVersion
        hideDocumentStyle
      ></DocumentActions>
      <Button
        className={styles.hoverVisible}
        onClick={createDocument}
        type="tertiary"
        theme="borderless"
        icon={<IconPlus />}
        size="small"
      />
    </span>
  );
};

const AddDocument = () => {
  const [wikiId, setWikiId] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [visible, toggleVisible] = useToggle(false);

  useEffect(() => {
    const handler = ({ wikiId, documentId }) => {
      if (!wikiId) {
        throw new Error(`wikiId 未知，无法创建文档`);
      }
      setWikiId(wikiId);
      setDocumentId(documentId);
      toggleVisible(true);
    };

    event.on(CREATE_DOCUMENT, handler);

    return () => {
      event.off(CREATE_DOCUMENT, handler);
    };
  }, [toggleVisible]);

  return (
    <DocumenCreatorForm wikiId={wikiId} parentDocumentId={documentId} visible={visible} toggleVisible={toggleVisible} />
  );
};

let scrollTimer;

const inheritColorStyle = { color: 'inherit' };

export const _Tree = ({ data, docAsLink, getDocLink, isShareMode = false, needAddDocument = false }) => {
  const { query } = useRouter();
  const $container = useRef<HTMLDivElement>(null);
  const [expandedKeys, setExpandedKeys] = useState([]);

  useEffect(() => {
    if (!data || !data.length) return;
    const parentIds = findParents(data, query.documentId as string);
    setExpandedKeys(parentIds);
  }, [data, query.documentId]);

  const renderBtn = useCallback((node) => <Actions key={node.id} node={node} />, []);

  const renderLabel = useCallback(
    (label, item) => (
      <div className={styles.treeItemWrap} id={`item-${item.id}`}>
        <Link href={docAsLink} as={getDocLink(item)}>
          <a className={styles.left}>
            <Typography.Text
              ellipsis={{
                showTooltip: { opts: { content: label, style: { wordBreak: 'break-all' }, position: 'right' } },
              }}
              style={inheritColorStyle}
            >
              {label}
            </Typography.Text>
          </a>
        </Link>
        {isShareMode ? null : renderBtn(item)}
      </div>
    ),
    [isShareMode, docAsLink, getDocLink, renderBtn]
  );

  useEffect(() => {
    const target = $container.current.querySelector(`#item-${query.documentId}`);
    if (!target) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      scrollIntoView(target, {
        behavior: 'smooth',
        scrollMode: 'if-needed',
      });
    }, 500);

    return () => {
      clearTimeout(scrollTimer);
    };
  }, [query.documentId]);

  return (
    <div className={styles.treeInnerWrap} ref={$container}>
      <SemiTree
        treeData={data}
        renderLabel={renderLabel}
        value={query.documentId}
        defaultExpandedKeys={expandedKeys}
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        motion={false}
      />
      {needAddDocument && <AddDocument />}
    </div>
  );
};

export const Tree = React.memo(_Tree, (prevProps, nextProps) => {
  if (deepEqual(prevProps.data, nextProps.data)) {
    return true;
  }

  return false;
});
