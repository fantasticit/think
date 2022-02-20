import { NextPage } from "next";
import { PublicDoubleColumnLayout } from "layouts/public-double-column";
import { usePublicWikiHomeDoc } from "data/wiki";
import { DataRender } from "components/data-render";
import { WikiPublicTocs } from "components/wiki/tocs/public";
import { DocumentPublicReader } from "components/document/reader/public";

interface IProps {
  wikiId: string;
}

const Page: NextPage<IProps> = ({ wikiId }) => {
  const {
    data: doc,
    loading: homeDocLoading,
    error: homeDocError,
  } = usePublicWikiHomeDoc(wikiId);

  return (
    <PublicDoubleColumnLayout
      leftNode={<WikiPublicTocs pageTitle="概览" wikiId={wikiId} />}
      rightNode={
        <DataRender
          loading={homeDocLoading}
          error={homeDocError}
          normalContent={() => {
            return (
              <DocumentPublicReader key={doc.id} documentId={doc.id} hideLogo />
            );
          }}
        />
      }
    ></PublicDoubleColumnLayout>
  );
};

Page.getInitialProps = async (ctx) => {
  const { wikiId } = ctx.query;
  return { wikiId } as IProps;
};

export default Page;
