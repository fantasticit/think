import { Spin } from '@douyinfe/semi-ui';
import { IWiki, WikiApiDefinition } from '@think/domains';
import { DataRender } from 'components/data-render';
import { DocumentReader } from 'components/document/reader';
import { WikiTocs } from 'components/wiki/tocs';
import { getWikiDetail, getWikiTocs, useWikiDetail } from 'data/wiki';
import { AppDoubleColumnLayout } from 'layouts/app-double-column';
import { NextPage } from 'next';
import React from 'react';
import { serverPrefetcher } from 'services/server-prefetcher';

interface IProps {
  wikiId: string;
}

const Page: NextPage<IProps> = ({ wikiId }) => {
  const { data: wiki, loading, error } = useWikiDetail(wikiId);

  return (
    <AppDoubleColumnLayout
      leftNode={<WikiTocs wikiId={wikiId} />}
      rightNode={
        <DataRender
          loading={loading}
          loadingContent={
            <div
              style={{
                minHeight: 240,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 'auto',
              }}
            >
              <Spin />
            </div>
          }
          error={error}
          normalContent={() => <DocumentReader key={wiki.homeDocumentId} documentId={wiki.homeDocumentId} />}
        />
      }
    />
  );
};

Page.getInitialProps = async (ctx) => {
  const { wikiId } = ctx.query;
  const res = await serverPrefetcher(ctx, [
    {
      url: WikiApiDefinition.getDetailById.client(wikiId as IWiki['id']),
      action: (cookie) => getWikiDetail(wikiId, cookie),
    },
    {
      url: WikiApiDefinition.getTocsById.client(wikiId as IWiki['id']),
      action: (cookie) => getWikiTocs(wikiId, cookie),
    },
  ]);
  return { ...res, wikiId } as IProps;
};

export default Page;
