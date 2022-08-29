import { DocumentApiDefinition, IDocument, IWiki, WikiApiDefinition } from '@think/domains';
import { DocumentPublicReader } from 'components/document/reader/public';
import { WikiPublicTocs } from 'components/wiki/tocs/public';
import { getPublicDocumentDetail } from 'data/document';
import { getPublicWikiTocs } from 'data/wiki';
import { PublicDoubleColumnLayout } from 'layouts/public-double-column';
import { NextPage } from 'next';
import React from 'react';
import { serverPrefetcher } from 'services/server-prefetcher';

interface IProps {
  wikiId: string;
  documentId: string;
}

const Page: NextPage<IProps> = ({ wikiId, documentId }) => {
  return (
    <PublicDoubleColumnLayout
      leftNode={<WikiPublicTocs pageTitle="概览" wikiId={wikiId} />}
      rightNode={<DocumentPublicReader key={documentId} documentId={documentId} hideLogo />}
    ></PublicDoubleColumnLayout>
  );
};

Page.getInitialProps = async (ctx) => {
  const { wikiId, documentId } = ctx.query;
  const res = await serverPrefetcher(ctx, [
    {
      url: WikiApiDefinition.getPublicTocsById.client(wikiId as IWiki['id']),
      action: () => getPublicWikiTocs(wikiId),
      ignoreCookie: true,
    },
    {
      url: DocumentApiDefinition.getPublicDetailById.client(documentId as IDocument['id']),
      // 默认无密码公开文档，如果有密码，客户端重新获取
      action: () => getPublicDocumentDetail(documentId as IDocument['id'], { sharePassword: '' }),
      ignoreCookie: true,
    },
  ]);
  return { ...res, wikiId, documentId } as IProps;
};

export default Page;
