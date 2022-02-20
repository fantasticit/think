import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Avatar, Typography, Space, Dropdown } from "@douyinfe/semi-ui";
import { IconChevronDown } from "@douyinfe/semi-icons";
import { useStaredWikis, useWikiDetail } from "data/wiki";
import { Empty } from "components/empty";
import { DataRender } from "components/data-render";
import { WikiStar } from "components/wiki/star";
import { Placeholder } from "./Placeholder";
import styles from "./index.module.scss";

const { Text } = Typography;

export const Wiki = () => {
  const { query } = useRouter();
  const {
    data: starWikis,
    loading,
    error,
    refresh: refreshStarWikis,
  } = useStaredWikis();
  const { data: currentWiki } = useWikiDetail(query.wikiId);

  return (
    <Dropdown
      trigger="click"
      spacing={16}
      content={
        <div
          style={{
            width: 300,
            paddingBottom: 8,
          }}
        >
          {currentWiki && (
            <>
              <div className={styles.titleWrap}>
                <Text strong type="secondary">
                  当前
                </Text>
              </div>
              <div className={styles.itemWrap}>
                <Link
                  href={{
                    pathname: "/wiki/[wikiId]",
                    query: {
                      wikiId: currentWiki.id,
                    },
                  }}
                >
                  <a className={styles.item}>
                    <div className={styles.leftWrap}>
                      <Avatar
                        shape="square"
                        size="small"
                        src={currentWiki.avatar}
                        style={{
                          marginRight: 8,
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                        }}
                      >
                        {currentWiki.name.charAt(0)}
                      </Avatar>
                      <div>
                        <Text
                          ellipsis={{ showTooltip: true }}
                          style={{ width: 180 }}
                        >
                          {currentWiki.name}
                        </Text>
                      </div>
                    </div>
                    <div className={styles.rightWrap}>
                      <WikiStar
                        wikiId={currentWiki.id}
                        onChange={refreshStarWikis}
                      />
                    </div>
                  </a>
                </Link>
              </div>
            </>
          )}
          <div className={styles.titleWrap}>
            <Text strong type="secondary">
              已收藏
            </Text>
          </div>
          <DataRender
            loading={loading}
            loadingContent={<Placeholder />}
            error={error}
            normalContent={() => {
              return (
                <div className={styles.itemsWrap}>
                  {starWikis.length ? (
                    starWikis.map((wiki) => {
                      return (
                        <div className={styles.itemWrap}>
                          <Link
                            href={{
                              pathname: "/wiki/[wikiId]",
                              query: {
                                wikiId: wiki.id,
                              },
                            }}
                          >
                            <a className={styles.item}>
                              <div className={styles.leftWrap}>
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
                                <div>
                                  <Text
                                    ellipsis={{ showTooltip: true }}
                                    style={{ width: 180 }}
                                  >
                                    {wiki.name}
                                  </Text>
                                </div>
                              </div>
                              <div className={styles.rightWrap}>
                                <WikiStar
                                  wikiId={wiki.id}
                                  onChange={refreshStarWikis}
                                />
                              </div>
                            </a>
                          </Link>
                        </div>
                      );
                    })
                  ) : (
                    <Empty message="收藏的知识库会出现在此处" />
                  )}
                </div>
              );
            }}
          />
          <Dropdown.Divider />
          <div className={styles.itemWrap}>
            <Link
              href={{
                pathname: "/wiki",
              }}
            >
              <a className={styles.item} style={{ padding: "12px 16px" }}>
                <Text>查看所有知识库</Text>
              </a>
            </Link>
          </div>
        </div>
      }
    >
      <span>
        <Space>
          知识库
          <IconChevronDown />
        </Space>
      </span>
    </Dropdown>
  );
};
