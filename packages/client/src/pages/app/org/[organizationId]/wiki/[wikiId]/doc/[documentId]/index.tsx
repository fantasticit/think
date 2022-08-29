import { DocumentApiDefinition, IDocument, IWiki, WikiApiDefinition } from '@think/domains';
import { DocumentReader } from 'components/document/reader';
import { WikiTocs } from 'components/wiki/tocs';
import { getDocumentDetail } from 'data/document';
import { getWikiTocs } from 'data/wiki';
import { AppDoubleColumnLayout } from 'layouts/app-double-column';
import { NextPage } from 'next';
import React from 'react';
import { serverPrefetcher } from 'services/server-prefetcher';

interface IProps {
  wikiId: string;
  documentId: string;
}

const Page: NextPage<IProps> = ({ wikiId, documentId }) => {
  return (
    <AppDoubleColumnLayout
      leftNode={<WikiTocs wikiId={wikiId} />}
      rightNode={<DocumentReader key={documentId} documentId={documentId} />}
    />
  );
};

Page.getInitialProps = async (ctx) => {
  const { wikiId, documentId } = ctx.query;

  const res = await serverPrefetcher(ctx, [
    {
      url: WikiApiDefinition.getTocsById.client(wikiId as IWiki['id']),
      action: (cookie) => getWikiTocs(wikiId, cookie),
    },
    {
      url: DocumentApiDefinition.getDetailById.client(documentId as IDocument['id']),
      action: (cookie) => getDocumentDetail(documentId, cookie),
    },
  ]);
  return { ...res, wikiId, documentId } as IProps;
};

export default Page;
