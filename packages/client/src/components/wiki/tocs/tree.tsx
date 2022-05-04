import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Tree as SemiTree, Button, Typography } from '@douyinfe/semi-ui';
import { IconMore, IconPlus } from '@douyinfe/semi-icons';
import { useToggle } from 'hooks/use-toggle';
import { DocumentActions } from 'components/document/actions';
import { DocumentCreator as DocumenCreatorForm } from 'components/document/create';
import { event, CREATE_DOCUMENT, triggerCreateDocument } from 'event';
import styles from './index.module.scss';

const Actions = ({ node }) => {
  return (
    <span className={styles.right}>
      <DocumentActions wikiId={node.wikiId} documentId={node.id}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
          }}
          type="tertiary"
          theme="borderless"
          icon={<IconMore />}
          size="small"
        />
      </DocumentActions>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          triggerCreateDocument({ wikiId: node.wikiId, documentId: node.id });
        }}
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

export const Tree = ({ data, docAsLink, getDocLink, parentIds, activeId, isShareMode = false }) => {
  const [expandedKeys, setExpandedKeys] = useState(parentIds);

  const renderBtn = useCallback((node) => <Actions key={node.id} node={node} />, []);

  const renderLabel = useCallback(
    (label, item) => (
      <div className={styles.treeItemWrap}>
        <Link href={docAsLink} as={getDocLink(item.id)}>
          <a className={styles.left}>
            <Typography.Text
              ellipsis={{
                showTooltip: { opts: { content: label, style: { wordBreak: 'break-all' }, position: 'right' } },
              }}
              style={{ color: 'inherit' }}
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
    if (!parentIds || !parentIds.length) return;
    setExpandedKeys(parentIds);
  }, [parentIds]);

  return (
    <div className={styles.treeInnerWrap}>
      <SemiTree
        treeData={data}
        renderLabel={renderLabel}
        value={activeId}
        defaultExpandedKeys={parentIds}
        expandedKeys={expandedKeys}
        onExpand={(expandedKeys) => setExpandedKeys(expandedKeys)}
      />
      <AddDocument />
    </div>
  );
};
