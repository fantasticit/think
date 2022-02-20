import { NextPage } from "next";
import { DoubleColumnLayout } from "layouts/double-column";
import { useWikiHomeDoc } from "data/wiki";
import { DataRender } from "components/data-render";
import { WikiTocs } from "components/wiki/tocs";
import { DocumentReader } from "components/document/reader";

interface IProps {
  wikiId: string;
}

const Page: NextPage<IProps> = ({ wikiId }) => {
  const { data: doc, loading, error } = useWikiHomeDoc(wikiId);

  return (
    <DoubleColumnLayout
      leftNode={<WikiTocs pageTitle="概览" wikiId={wikiId} />}
      rightNode={
        <DataRender
          loading={loading}
          error={error}
          normalContent={() => (
            <DocumentReader key={doc.id} documentId={doc.id} />
          )}
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
