import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Avatar, Button, Typography, Skeleton } from "@douyinfe/semi-ui";
import { IconPlus } from "@douyinfe/semi-icons";
import { useWikiDetail, useWikiTocs } from "data/wiki";
import { useToggle } from "hooks/useToggle";
import { Seo } from "components/seo";
import { findParents } from "components/wiki/tocs/utils";
import { IconDocument, IconSetting, IconOverview } from "components/icons";
import { DocumentCreator } from "components/document/create";
import { DataRender } from "components/data-render";
import { TreeMenu } from "./menu";
import { NavItem } from "./NavItem";

import { Tree } from "./tree";

import styles from "./index.module.scss";

interface IProps {
  wikiId: string;
  documentId?: string;
  docAsLink?: string;
  getDocLink?: (arg: string) => string;
  pageTitle: string;
}

const { Text } = Typography;

export const WikiTocs: React.FC<IProps> = ({
  pageTitle,
  wikiId,
  documentId = null,
  docAsLink = "/wiki/[wikiId]/document/[documentId]",
  getDocLink = (documentId) => `/wiki/${wikiId}/document/${documentId}`,
}) => {
  const { pathname } = useRouter();
  const [visible, toggleVisible] = useToggle(false);
  const {
    data: wiki,
    loading: wikiLoading,
    error: wikiError,
  } = useWikiDetail(wikiId);
  const {
    data: tocs,
    loading: tocsLoading,
    error: tocsError,
  } = useWikiTocs(wikiId, documentId);
  const [parentIds, setParentIds] = useState<Array<string>>([]);

  useEffect(() => {
    if (!tocs || !tocs.length) return;
    const parentIds = findParents(tocs, documentId);
    setParentIds(parentIds);
  }, [tocs, documentId]);

  return (
    <div className={styles.wrap}>
      <DataRender
        loading={wikiLoading}
        loadingContent={
          <NavItem
            icon={
              <Skeleton.Avatar
                size="small"
                style={{
                  marginRight: 8,
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                }}
              ></Skeleton.Avatar>
            }
            text={<Skeleton.Title style={{ width: 120 }} />}
          />
        }
        error={wikiError}
        normalContent={() => (
          <>
            <Seo title={wiki.name + " - " + pageTitle} />
            <NavItem
              icon={
                <Avatar
                  shape="square"
                  size="small"
                  src={wiki.avatar}
                  style={{
                    marginRight: 8,
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                  }}
                >
                  {wiki.name.charAt(0)}
                </Avatar>
              }
              text={<Text strong>{wiki.name}</Text>}
              hoverable={false}
            />
          </>
        )}
      />

      <NavItem
        icon={<IconOverview />}
        text={"概述"}
        href={{
          pathname: `/wiki/[wikiId]`,
          query: { wikiId },
        }}
        isActive={pathname === "/wiki/[wikiId]"}
      />

      <NavItem
        icon={<IconSetting />}
        text={"设置"}
        href={{
          pathname: `/wiki/[wikiId]/setting`,
          query: { tab: "base", wikiId },
        }}
        isActive={pathname === "/wiki/[wikiId]/setting"}
      />

      <DataRender
        loading={wikiLoading}
        loadingContent={
          <NavItem
            icon={
              <Skeleton.Avatar
                size="small"
                style={{
                  marginRight: 8,
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                }}
              ></Skeleton.Avatar>
            }
            text={<Skeleton.Title style={{ width: 120 }} />}
            rightNode={<IconPlus />}
          />
        }
        error={wikiError}
        normalContent={() => (
          <NavItem
            icon={<IconDocument />}
            text={"文档管理"}
            href={{
              pathname: `/wiki/[wikiId]/documents`,
              query: { wikiId },
            }}
            isActive={pathname === "/wiki/[wikiId]/documents"}
            rightNode={
              <>
                <Button
                  style={{ fontSize: "1em" }}
                  theme="borderless"
                  type="tertiary"
                  icon={<IconPlus style={{ fontSize: "1em" }} />}
                  size="small"
                  onClick={toggleVisible}
                />
                <DocumentCreator
                  wikiId={wiki.id}
                  visible={visible}
                  toggleVisible={toggleVisible}
                />
              </>
            }
          />
        )}
      />

      <div className={styles.treeWrap}>
        <DataRender
          loading={tocsLoading}
          loadingContent={
            <NavItem
              icon={
                <Skeleton.Avatar
                  size="small"
                  style={{
                    marginRight: 8,
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                  }}
                ></Skeleton.Avatar>
              }
              text={<Skeleton.Title style={{ width: 120 }} />}
              rightNode={<IconPlus />}
            />
          }
          error={tocsError}
          normalContent={() => (
            <Tree
              data={tocs || []}
              docAsLink={docAsLink}
              getDocLink={getDocLink}
              parentIds={parentIds}
              activeId={documentId}
            />
          )}
        />
      </div>
    </div>
  );
};
