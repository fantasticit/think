import { DocumentReader } from 'components/document/reader';
import { WikiTocs } from 'components/wiki/tocs';
import { DoubleColumnLayout } from 'layouts/double-column';
import { NextPage } from 'next';
import React from 'react';

interface IProps {
  wikiId: string;
  documentId: string;
}

const Page: NextPage<IProps> = ({ wikiId, documentId }) => {
  return (
    <DoubleColumnLayout
      leftNode={<WikiTocs wikiId={wikiId} documentId={documentId} />}
      rightNode={<DocumentReader key={documentId} documentId={documentId} />}
    />
  );
};

Page.getInitialProps = async (ctx) => {
  const { wikiId, documentId } = ctx.query;
  return { wikiId, documentId } as IProps;
};

export default Page;
