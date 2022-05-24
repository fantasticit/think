import { IWiki, WikiApiDefinition } from '@think/domains';
import { DataRender } from 'components/data-render';
import { DocumentPublicReader } from 'components/document/reader/public';
import { WikiPublicTocs } from 'components/wiki/tocs/public';
import { getPublicWikiDetail, getPublicWikiHomeDocument, getPublicWikiTocs, usePublicWikiHomeDoc } from 'data/wiki';
import { PublicDoubleColumnLayout } from 'layouts/public-double-column';
import { NextPage } from 'next';
import React from 'react';
import { serverPrefetcher } from 'services/server-prefetcher';

interface IProps {
  wikiId: string;
}

const Page: NextPage<IProps> = ({ wikiId }) => {
  const { data: doc, loading: homeDocLoading, error: homeDocError } = usePublicWikiHomeDoc(wikiId);

  return (
    <PublicDoubleColumnLayout
      leftNode={<WikiPublicTocs pageTitle="概览" wikiId={wikiId} />}
      rightNode={
        <DataRender
          loading={homeDocLoading}
          error={homeDocError}
          normalContent={() => {
            return <DocumentPublicReader key={doc.id} documentId={doc.id} hideLogo />;
          }}
        />
      }
    ></PublicDoubleColumnLayout>
  );
};

Page.getInitialProps = async (ctx) => {
  const { wikiId } = ctx.query;
  const res = await serverPrefetcher(ctx, [
    {
      url: WikiApiDefinition.getPublicDetailById.client(wikiId as IWiki['id']),
      action: () => getPublicWikiDetail(wikiId),
      ignoreCookie: true,
    },
    {
      url: WikiApiDefinition.getPublicHomeDocumentById.client(wikiId as IWiki['id']),
      action: () => getPublicWikiHomeDocument(wikiId),
      ignoreCookie: true,
    },
    {
      url: WikiApiDefinition.getPublicTocsById.client(wikiId as IWiki['id']),
      action: () => getPublicWikiTocs(wikiId),
      ignoreCookie: true,
    },
  ]);
  return { wikiId, ...res } as IProps;
};

export default Page;
