import type { NextPage } from 'next';
import type { IDocument } from '@think/domains';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { Typography, Button, Table, List } from '@douyinfe/semi-ui';
import { useToggle } from 'hooks/use-toggle';
import { Seo } from 'components/seo';
import { DataRender } from 'components/data-render';
import { SingleColumnLayout } from 'layouts/single-column';
import { WikiCreator } from 'components/wiki/create';
import { LocaleTime } from 'components/locale-time';
import { DocumentActions } from 'components/document/actions';
import { useStaredWikis } from 'data/wiki';
import { useRecentDocuments } from 'data/document';
import { WikiPinCardPlaceholder, WikiPinCard } from 'components/wiki/pin-card';
import { Empty } from 'components/empty';
import styles from './index.module.scss';

const { Title } = Typography;
const { Column } = Table;

const grid = {
  gutter: 16,
  xs: 24,
  sm: 12,
  md: 12,
  lg: 8,
  xl: 8,
};

const RecentDocs = () => {
  const { data, error, loading, refresh } = useRecentDocuments();

  const columns = useMemo(
    () => [
      <Column
        title="标题"
        dataIndex="title"
        key="title"
        render={(_, document: IDocument) => {
          return (
            <Link href={'/wiki/[wikiId]/document/[docId]'} as={`/wiki/${document.wikiId}/document/${document.id}`}>
              <a style={{ color: 'inherit', textDecoration: 'none' }}>{document.title}</a>
            </Link>
          );
        }}
      />,
      <Column title="阅读量" dataIndex="views" key="views" />,
      <Column
        title="更新时间"
        dataIndex="updatedAt"
        key="updatedAt"
        render={(date) => <LocaleTime date={date} timeago />}
      />,
      <Column
        title="操作"
        dataIndex="operate"
        key="operate"
        render={(_, document) => (
          <DocumentActions
            wikiId={document.wikiId}
            documentId={document.id}
            onStar={refresh}
            onDelete={refresh}
            showCreateDocument
          />
        )}
      />,
    ],
    [refresh]
  );

  return (
    <>
      <Title heading={3} style={{ margin: '24px 0 0' }}>
        最近访问
      </Title>
      <DataRender
        loading={loading}
        loadingContent={
          <Table dataSource={[]} loading={true} pagination={false} size="small" style={{ marginTop: 16 }}>
            {columns}
          </Table>
        }
        error={error}
        normalContent={() =>
          data && data.length ? (
            <Table dataSource={data} loading={loading} pagination={false} size="small" style={{ marginTop: 16 }}>
              {columns}
            </Table>
          ) : (
            <Empty message="最近访问的文档会出现在此处" />
          )
        }
      />
    </>
  );
};

const Page: NextPage = () => {
  const [visible, toggleVisible] = useToggle(false);
  const { data: staredWikis, loading, error } = useStaredWikis();

  return (
    <SingleColumnLayout>
      <Seo title="主页" />
      <div className="container">
        <div className={styles.titleWrap}>
          <Title heading={3} style={{ margin: '8px 0' }}>
            快捷访问
          </Title>
          <>
            <Button onClick={toggleVisible}>创建知识库</Button>
            <WikiCreator visible={visible} toggleVisible={toggleVisible} />
          </>
        </div>
        <DataRender
          loading={loading}
          loadingContent={() => (
            <List
              grid={grid}
              dataSource={[1, 2, 3]}
              renderItem={() => (
                <List.Item>
                  <WikiPinCardPlaceholder />
                </List.Item>
              )}
            />
          )}
          error={error}
          normalContent={() => (
            <List
              grid={grid}
              dataSource={staredWikis}
              renderItem={(wiki) => (
                <List.Item>
                  <WikiPinCard wiki={wiki} />
                </List.Item>
              )}
              emptyContent={<Empty message="收藏的知识库会出现在此处" />}
            />
          )}
        />
        <RecentDocs />
      </div>
    </SingleColumnLayout>
  );
};

export default Page;
