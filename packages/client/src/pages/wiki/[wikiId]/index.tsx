import { DataRender } from 'components/data-render';
import { DocumentReader } from 'components/document/reader';
import { WikiTocs } from 'components/wiki/tocs';
import { useWikiHomeDoc } from 'data/wiki';
import { DoubleColumnLayout } from 'layouts/double-column';
import { NextPage } from 'next';
import React from 'react';

interface IProps {
  wikiId: string;
}

const Page: NextPage<IProps> = ({ wikiId }) => {
  const { data: doc, loading, error } = useWikiHomeDoc(wikiId);

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
  return { wikiId } as IProps;
};

export default Page;
