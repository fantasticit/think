import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Typography, Button, Modal, Input, Spin } from '@douyinfe/semi-ui';
import { IconSearch as SemiIconSearch } from '@douyinfe/semi-icons';
import { IconSearch } from 'components/icons';
import { IDocument } from '@think/domains';
import { useRecentDocuments } from 'data/document';
import { useToggle } from 'hooks/useToggle';
import { useAsyncLoading } from 'hooks/useAsyncLoading';
import { searchDocument } from 'services/document';
import { Empty } from 'components/empty';
import { DataRender } from 'components/data-render';
import { LocaleTime } from 'components/locale-time';
import { DocumentStar } from 'components/document/star';
import { IconDocumentFill } from 'components/icons/IconDocumentFill';
import styles from './index.module.scss';

const { Text } = Typography;

const List: React.FC<{ data: IDocument[] }> = ({ data }) => {
  return (
    <div className={styles.itemsWrap}>
      {data.length ? (
        data.map((doc) => {
          return (
            <div className={styles.itemWrap} key={doc.id}>
              <Link
                href={{
                  pathname: '/wiki/[wikiId]/document/[documentId]',
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
                      <Text ellipsis={{ showTooltip: true }} style={{ width: 180 }}>
                        {doc.title}
                      </Text>

                      <Text size="small" type="tertiary">
                        创建者：
                        {doc.createUser && doc.createUser.name} • <LocaleTime date={doc.updatedAt} timeago />
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
        <Empty message="暂无搜索结果" />
      )}
    </div>
  );
};

export const Search = () => {
  const [visible, toggleVisible] = useToggle(false);
  const { data: recentDocs } = useRecentDocuments();
  const [searchApi, loading] = useAsyncLoading(searchDocument, 10);
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState(null);
  const [searchDocs, setSearchDocs] = useState<IDocument[]>([]);

  const search = useCallback(() => {
    setError(null);
    searchApi(keyword)
      .then((res) => {
        setSearchDocs(res);
      })
      .catch((err) => {
        setError(err);
      });
  }, [searchApi, keyword]);

  useEffect(() => {
    const fn = () => {
      toggleVisible(false);
    };

    Router.events.on('routeChangeStart', fn);

    return () => {
      Router.events.off('routeChangeStart', fn);
    };
  }, [toggleVisible]);

  return (
    <>
      <Button type="tertiary" theme="borderless" icon={<IconSearch />} onClick={toggleVisible} />
      <Modal
        visible={visible}
        title="文档搜索"
        footer={null}
        onCancel={toggleVisible}
        style={{
          maxWidth: '96vw',
        }}
        bodyStyle={{
          height: '68vh',
        }}
      >
        <div style={{ paddingBottom: 24 }}>
          <div>
            <Input
              placeholder={'搜索文档'}
              size="large"
              value={keyword}
              onChange={(val) => {
                setSearchDocs([]);
                setKeyword(val);
              }}
              onEnterPress={search}
              suffix={<SemiIconSearch onClick={search} style={{ cursor: 'pointer' }} />}
              showClear
            />
          </div>
          <div style={{ height: 'calc(68vh - 40px)', paddingBottom: 36, overflow: 'auto' }}>
            <DataRender
              loading={loading}
              loadingContent={
                <div
                  style={{
                    paddingTop: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Spin />
                </div>
              }
              error={error}
              normalContent={() => <List data={searchDocs} />}
            />
            <div style={{ marginTop: 16 }}>
              <Text type="tertiary">最近访问的文档</Text>
              <List data={recentDocs} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
