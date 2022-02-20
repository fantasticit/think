import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Avatar, Typography, Skeleton, Space } from "@douyinfe/semi-ui";
import { IconPlus } from "@douyinfe/semi-icons";
import { IconOverview } from "components/icons";
import { usePublicWikiDetail, usePublicWikiTocs } from "data/wiki";
import { Seo } from "components/seo";
import { findParents } from "components/wiki/tocs/utils";
import { LogoImage, LogoText } from "components/logo";
import { DataRender } from "components/data-render";
import { TreeMenu } from "./menu";
import { NavItem } from "./NavItem";
import styles from "./index.module.scss";

interface IProps {
  wikiId: string;
  documentId?: string;
  docAsLink?: string;
  getDocLink?: (arg: string) => string;
  pageTitle: string;
}

const { Text } = Typography;

export const WikiPublicTocs: React.FC<IProps> = ({
  pageTitle,
  wikiId,
  documentId = null,
  docAsLink = "/share/wiki/[wikiId]/document/[documentId]",
  getDocLink = (documentId) => `/share/wiki/${wikiId}/document/${documentId}`,
}) => {
  const { pathname } = useRouter();
  const {
    data: wiki,
    loading: wikiLoading,
    error: wikiError,
  } = usePublicWikiDetail(wikiId);
  const {
    data: tocs,
    loading: tocsLoading,
    error: tocsError,
  } = usePublicWikiTocs(wikiId);
  const [parentIds, setParentIds] = useState<Array<string>>([]);

  useEffect(() => {
    if (!tocs || !tocs.length) return;
    const parentIds = findParents(tocs, documentId);
    setParentIds(parentIds);
  }, [tocs, documentId]);

  return (
    <div className={styles.wrap}>
      <div className={styles.navItemWrap}>
        <div className={styles.navItem}>
          <Space>
            <LogoImage /> <LogoText />
          </Space>
        </div>
      </div>

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
          pathname: `/share/wiki/[wikiId]`,
          query: { wikiId },
        }}
        isActive={pathname === "/share/wiki/[wikiId]"}
      />

      <div className={styles.treeWrap} style={{ marginTop: 12 }}>
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
            <TreeMenu
              data={tocs || []}
              docAsLink={docAsLink}
              getDocLink={getDocLink}
              parentIds={parentIds}
              activeId={documentId}
              isShareMode={true}
            />
          )}
        />
      </div>
    </div>
  );
};
