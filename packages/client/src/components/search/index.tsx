import { IconSearch as SemiIconSearch } from '@douyinfe/semi-icons';
import { Button, Dropdown, Input, Modal, Spin, Typography } from '@douyinfe/semi-ui';
import { IDocument } from '@think/domains';
import { DataRender } from 'components/data-render';
import { DocumentStar } from 'components/document/star';
import { Empty } from 'components/empty';
import { IconSearch } from 'components/icons';
import { IconDocumentFill } from 'components/icons/IconDocumentFill';
import { LocaleTime } from 'components/locale-time';
import { useSearchDocuments } from 'data/document';
import { useAsyncLoading } from 'hooks/use-async-loading';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { useRouterQuery } from 'hooks/use-router-query';
import { useToggle } from 'hooks/use-toggle';
import Link from 'next/link';
import Router from 'next/router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HttpClient } from 'services/http-client';

import styles from './index.module.scss';

const { Text } = Typography;

const searchDocument = (organizationId, keyword: string): Promise<IDocument[]> => {
  return HttpClient.get(`/document/search/${organizationId}`, { params: { keyword } });
};

const List: React.FC<{ data: IDocument[] }> = ({ data }) => {
  return (
    <div className={styles.itemsWrap}>
      {data.length ? (
        data.map((doc) => {
          return (
            <div className={styles.itemWrap} key={doc.id}>
              <Link
                href={{
                  pathname: `/app/org/[organizationId]/wiki/[wikiId]/doc/[documentId]`,
                  query: { organizationId: doc.organizationId, wikiId: doc.wikiId, documentId: doc.id },
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
                        {doc.createUser && doc.createUser.name} • <LocaleTime date={doc.updatedAt} />
                      </Text>
                    </div>
                  </div>
                  <div className={styles.rightWrap}>
                    <DocumentStar organizationId={doc.organizationId} wikiId={doc.wikiId} documentId={doc.id} />
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
  const { organizationId } = useRouterQuery<{ organizationId: string }>();
  const { search: searchApi, loading } = useSearchDocuments(organizationId);

  const ref = useRef<HTMLInputElement>();
  const { isMobile } = IsOnMobile.useHook();
  const [visible, toggleVisible] = useToggle(false);
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

  const onKeywordChange = useCallback((val) => {
    setSearchDocs([]);
    setKeyword(val);
  }, []);

  const content = useMemo(
    () => (
      <div style={{ paddingBottom: 24 }}>
        <div>
          <Input
            showClear
            ref={ref}
            placeholder={'搜索文档'}
            value={keyword}
            onChange={onKeywordChange}
            onEnterPress={search}
            suffix={<SemiIconSearch onClick={search} style={{ cursor: 'pointer' }} />}
          />
        </div>
        <div style={{ height: '40vh', paddingBottom: 36, overflow: 'auto' }}>
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
        </div>
      </div>
    ),
    [error, keyword, loading, onKeywordChange, search, searchDocs]
  );

  const btn = useMemo(
    () => <Button type="tertiary" theme="borderless" icon={<IconSearch />} onClick={toggleVisible} />,
    [toggleVisible]
  );

  useEffect(() => {
    if (visible) {
      setTimeout(() => ref.current?.focus(), 100);
    }
  }, [visible]);

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
      {!isMobile ? (
        <Dropdown
          position="bottomRight"
          trigger="click"
          visible={visible}
          onVisibleChange={toggleVisible}
          content={
            <div style={{ width: 320, maxWidth: '96vw', maxHeight: '70vh', overflow: 'auto', padding: '16px 16px 0' }}>
              {content}
            </div>
          }
        >
          {btn}
        </Dropdown>
      ) : (
        <>
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
            {content}
          </Modal>
          {btn}
        </>
      )}
    </>
  );
};
