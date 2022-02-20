import type { IDocument } from "@think/share";
import React, { useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import cls from "classnames";
import { Button } from "@douyinfe/semi-ui";
import {
  IconChevronRight,
  IconChevronDown,
  IconRadio,
  IconMore,
} from "@douyinfe/semi-icons";
import { useToggle } from "hooks/useToggle";
import { DocumentActions } from "components/document/actions";
import styles from "./index.module.scss";

interface IProps {
  data: IDocument;
  hasChildren: boolean;
  docAsLink?: string;
  getDocLink?: (arg: string) => string;
  parentIds: Array<string>;
  activeId: string;
  isShareMode?: boolean;
}

export const MenuItem: React.FC<IProps> = ({
  data,
  hasChildren,
  docAsLink,
  getDocLink,
  parentIds,
  activeId,
  isShareMode = false,
  children,
}) => {
  const [opened, toggleOpened] = useToggle(false);
  const [isOperating, toggleOperating] = useToggle(false);
  const url = useMemo(() => getDocLink(data.id), [data.id]);
  const height = useMemo(() => (!opened ? 40 : 9999), [opened]);
  const isActive = useMemo(() => activeId === data.id, [activeId, data.id]);

  useEffect(() => {
    if (parentIds.includes(data.id)) {
      toggleOpened(true);
    }
  }, [parentIds, activeId, data.id]);

  const onClick = useCallback(
    (e) => {
      if (!hasChildren) return;
      e.preventDefault();
      e.stopPropagation();
      toggleOpened();
    },
    [hasChildren]
  );

  return (
    <li className={styles.wrap} style={{ maxHeight: height }}>
      <Link href={docAsLink} as={url}>
        <a className={cls(isActive && styles.isActive)}>
          <span className={cls(styles.icon)} onClick={onClick}>
            {hasChildren ? (
              opened ? (
                <IconChevronDown style={{ fontSize: "0.75em" }} />
              ) : (
                <IconChevronRight style={{ fontSize: "0.75em" }} />
              )
            ) : (
              <IconRadio style={{ fontSize: "0.75em" }} />
            )}
          </span>
          <span className={styles.title}>{data.title}</span>
          {isShareMode ? null : (
            <span
              className={cls(
                styles.rightAction,
                isOperating && styles.isActive
              )}
            >
              <DocumentActions
                wikiId={data.wikiId}
                documentId={data.id}
                onVisibleChange={toggleOperating}
              >
                <Button
                  style={{ fontSize: "1em" }}
                  theme="borderless"
                  type="tertiary"
                  icon={<IconMore style={{ fontSize: "1em" }} />}
                  size="small"
                  onClick={onClick}
                />
              </DocumentActions>
            </span>
          )}
        </a>
      </Link>
      {children}
    </li>
  );
};
