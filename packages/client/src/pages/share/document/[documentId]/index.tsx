import { DocumentApiDefinition, IDocument } from '@think/domains';
import { DocumentPublicReader } from 'components/document/reader/public';
import { getPublicDocumentDetail } from 'data/document';
import { NextPage } from 'next';
import React from 'react';
import { serverPrefetcher } from 'services/server-prefetcher';

interface IProps {
  documentId: string;
}

const Page: NextPage<IProps> = ({ documentId }) => {
  return <DocumentPublicReader key={documentId} documentId={documentId} />;
};

Page.getInitialProps = async (ctx) => {
  const { documentId } = ctx.query;
  const res = await serverPrefetcher(ctx, [
    {
      url: DocumentApiDefinition.getPublicDetailById.client(documentId as IDocument['id']),
      // 默认无密码公开文档，如果有密码，客户端重新获取
      action: () => getPublicDocumentDetail(documentId as IDocument['id'], { sharePassword: '' }),
      ignoreCookie: true,
    },
  ]);
  return { ...res, documentId } as IProps;
};

export default Page;
