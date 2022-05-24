import { IWiki, WikiApiDefinition } from '@think/domains';
import { DataRender } from 'components/data-render';
import { DocumentReader } from 'components/document/reader';
import { WikiTocs } from 'components/wiki/tocs';
import { getWikiDetail, getWikiHomeDocument, getWikiTocs, useWikiHomeDocument } from 'data/wiki';
import { DoubleColumnLayout } from 'layouts/double-column';
import { NextPage } from 'next';
import React from 'react';
import { serverPrefetcher } from 'services/server-prefetcher';

interface IProps {
  wikiId: string;
}

const Page: NextPage<IProps> = ({ wikiId }) => {
  const { data: doc, loading, error } = useWikiHomeDocument(wikiId);

  return (
    <DoubleColumnLayout
      leftNode={<WikiTocs wikiId={wikiId} />}
      rightNode={
        <DataRender
          loading={loading}
          error={error}
          normalContent={() => <DocumentReader key={doc.id} documentId={doc.id} />}
        />
      }
    ></DoubleColumnLayout>
  );
};

Page.getInitialProps = async (ctx) => {
  const { wikiId } = ctx.query;
  const res = await serverPrefetcher(ctx, [
    {
      url: WikiApiDefinition.getHomeDocumentById.client(wikiId as IWiki['id']),
      action: (cookie) => getWikiHomeDocument(cookie),
    },
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
