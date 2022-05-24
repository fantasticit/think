import { DocumentApiDefinition, IDocument } from '@think/domains';
import { DocumentEditor } from 'components/document/editor';
import { getDocumentDetail } from 'data/document';
import { NextPage } from 'next';
import React from 'react';
import { serverPrefetcher } from 'services/server-prefetcher';

interface IProps {
  wikiId: string;
  documentId: string;
}

const Page: NextPage<IProps> = ({ wikiId, documentId }) => {
  return <DocumentEditor key={documentId} documentId={documentId} />;
};

Page.getInitialProps = async (ctx) => {
  const { wikiId, documentId } = ctx.query;

  const res = await serverPrefetcher(ctx, [
    {
      url: DocumentApiDefinition.getDetailById.client(documentId as IDocument['id']),
      action: (cookie) => getDocumentDetail(documentId, cookie),
    },
  ]);
  return { ...res, wikiId, documentId } as IProps;
};

export default Page;
