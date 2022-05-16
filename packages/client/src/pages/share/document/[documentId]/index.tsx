import { DocumentPublicReader } from 'components/document/reader/public';
import { NextPage } from 'next';
import React from 'react';

interface IProps {
  documentId: string;
}

const Page: NextPage<IProps> = ({ documentId }) => {
  return <DocumentPublicReader key={documentId} documentId={documentId} />;
};

Page.getInitialProps = async (ctx) => {
  const { documentId } = ctx.query;
  return { documentId } as IProps;
};

export default Page;
