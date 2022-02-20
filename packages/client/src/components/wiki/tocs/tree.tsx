import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Tree as SemiTree, Button, Typography } from "@douyinfe/semi-ui";
import { IconMore, IconPlus } from "@douyinfe/semi-icons";
import { useToggle } from "hooks/useToggle";
import { DocumentActions } from "components/document/actions";
import { DocumentCreator as DocumenCreatorForm } from "components/document/create";
import { EventEmitter } from "helpers/event-emitter";
import styles from "./index.module.scss";

const em = new EventEmitter();

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
          em.emit("plus", node);
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
    em.on("plus", (node) => {
      setWikiId(node.wikiId);
      setDocumentId(node.id);
      toggleVisible(true);
    });

    return () => {
      em.destroy();
    };
  }, []);

  return (
    <DocumenCreatorForm
      wikiId={wikiId}
      parentDocumentId={documentId}
      visible={visible}
      toggleVisible={toggleVisible}
    />
  );
};

export const Tree = ({ data, docAsLink, getDocLink, parentIds, activeId }) => {
  const [expandedKeys, setExpandedKeys] = useState(parentIds);

  const renderBtn = useCallback(
    (node) => <Actions key={node.id} node={node} />,
    []
  );

  const renderLabel = useCallback(
    (label, item) => (
      <div className={styles.treeItemWrap}>
        <Link href={docAsLink} as={getDocLink(item.id)}>
          <a className={styles.left}>
            <Typography.Text
              ellipsis={{
                showTooltip: { opts: { content: label, position: "right" } },
              }}
              style={{ color: "inherit" }}
            >
              {label}
            </Typography.Text>
          </a>
        </Link>
        {renderBtn(item)}
      </div>
    ),
    []
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
