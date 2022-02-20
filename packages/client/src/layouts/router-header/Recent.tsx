import React from "react";
import Link from "next/link";
import { Typography, Space, Dropdown, Tabs, TabPane } from "@douyinfe/semi-ui";
import { IconChevronDown } from "@douyinfe/semi-icons";
import { useRecentDocuments } from "data/document";
import { Empty } from "components/empty";
import { DataRender } from "components/data-render";
import { LocaleTime } from "components/locale-time";
import { DocumentStar } from "components/document/star";
import { IconDocumentFill } from "components/icons/IconDocumentFill";
import { Placeholder } from "./Placeholder";
import styles from "./index.module.scss";

const { Text } = Typography;

export const Recent = () => {
  const { data: recentDocs, loading, error } = useRecentDocuments();

  return (
    <Dropdown
      trigger="click"
      spacing={16}
      content={
        <div style={{ width: 300, padding: "16px 16px 0" }}>
          <Tabs type="line" size="small">
            <TabPane tab="文档" itemKey="docs">
              <DataRender
                loading={loading}
                loadingContent={<Placeholder />}
                error={error}
                normalContent={() => {
                  return (
                    <div
                      className={styles.itemsWrap}
                      style={{ margin: "0 -16px" }}
                    >
                      {recentDocs.length ? (
                        recentDocs.map((doc) => {
                          return (
                            <div className={styles.itemWrap}>
                              <Link
                                href={{
                                  pathname:
                                    "/wiki/[wikiId]/document/[documentId]",
                                  query: {
                                    wikiId: doc.wikiId,
                                    documentId: doc.id,
                                  },
                                }}
                              >
                                <a className={styles.item}>
                                  <div className={styles.leftWrap}>
                                    <IconDocumentFill
                                      style={{ marginRight: 12 }}
                                    />
                                    <div>
                                      <Text
                                        ellipsis={{ showTooltip: true }}
                                        style={{ width: 180 }}
                                      >
                                        {doc.title}
                                      </Text>
                                      <Text size="small" type="tertiary">
                                        <LocaleTime
                                          date={doc.updatedAt}
                                          timeago
                                        />
                                      </Text>
                                    </div>
                                  </div>
                                  <div className={styles.rightWrap}>
                                    <DocumentStar documentId={doc.id} />
                                  </div>
                                </a>
                              </Link>
                            </div>
                          );
                        })
                      ) : (
                        <Empty message="最近访问的文档会出现在此处" />
                      )}
                    </div>
                  );
                }}
              />
            </TabPane>
          </Tabs>
        </div>
      }
    >
      <span>
        <Space>
          最近
          <IconChevronDown />
        </Space>
      </span>
    </Dropdown>
  );
};
