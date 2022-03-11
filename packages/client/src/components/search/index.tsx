import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { Typography, Button, Modal, Input } from "@douyinfe/semi-ui";
import { IconSearch } from "components/icons";
import { IDocument } from "@think/domains";
import { useRecentDocuments } from "data/document";
import { useToggle } from "hooks/useToggle";
import { searchDocument } from "services/document";
import { Empty } from "components/empty";
import { DataRender } from "components/data-render";
import { LocaleTime } from "components/locale-time";
import { DocumentStar } from "components/document/star";
import { IconDocumentFill } from "components/icons/IconDocumentFill";
import styles from "./index.module.scss";

const { Text } = Typography;

export const Search = () => {
  const [visible, toggleVisible] = useToggle(false);
  const { data: recentDocs, loading, error } = useRecentDocuments();
  const [keyword, setKeyword] = useState("");
  const [searchDocs, setSearchDocs] = useState<IDocument[]>([]);
  const data = useMemo(
    () => (searchDocs.length ? searchDocs : recentDocs),
    [searchDocs.length, recentDocs]
  );

  const search = useCallback(() => {
    searchDocument(keyword).then((res) => {
      setSearchDocs(res);
    });
  }, [keyword]);

  useEffect(() => {
    const fn = () => {
      toggleVisible(false);
    };
    Router.events.on("routeChangeStart", fn);

    return () => {
      Router.events.off("routeChangeStart", fn);
    };
  }, []);

  return (
    <>
      <Button
        type="tertiary"
        theme="borderless"
        icon={<IconSearch />}
        onClick={toggleVisible}
      />
      <Modal
        visible={visible}
        title="文档搜索"
        footer={null}
        onCancel={toggleVisible}
      >
        <div style={{ paddingBottom: 24 }}>
          <Input
            placeholder={"搜索文档"}
            size="large"
            value={keyword}
            onChange={(val) => setKeyword(val)}
            onEnterPress={search}
          />
          <DataRender
            loading={loading}
            error={error}
            normalContent={() => {
              return (
                <div className={styles.itemsWrap}>
                  {data.length ? (
                    data.map((doc) => {
                      return (
                        <div className={styles.itemWrap}>
                          <Link
                            href={{
                              pathname: "/wiki/[wikiId]/document/[documentId]",
                              query: {
                                wikiId: doc.wikiId,
                                documentId: doc.id,
                              },
                            }}
                          >
                            <a className={styles.item}>
                              <div className={styles.leftWrap}>
                                <IconDocumentFill style={{ marginRight: 12 }} />
                                <div>
                                  <Text
                                    ellipsis={{ showTooltip: true }}
                                    style={{ width: 180 }}
                                  >
                                    {doc.title}
                                  </Text>

                                  <Text size="small" type="tertiary">
                                    创建者：
                                    {doc.createUser &&
                                      doc.createUser.name} •{" "}
                                    <LocaleTime date={doc.updatedAt} timeago />
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
        </div>
      </Modal>
    </>
  );
};
