import { NextPage } from "next";
import { PublicDoubleColumnLayout } from "layouts/public-double-column";
import { WikiPublicTocs } from "components/wiki/tocs/public";
import { DocumentPublicReader } from "components/document/reader/public";

interface IProps {
  wikiId: string;
  documentId: string;
}

const Page: NextPage<IProps> = ({ wikiId, documentId }) => {
  return (
    <PublicDoubleColumnLayout
      leftNode={
        <WikiPublicTocs
          pageTitle="概览"
          wikiId={wikiId}
          documentId={documentId}
        />
      }
      rightNode={
        <DocumentPublicReader
          key={documentId}
          documentId={documentId}
          hideLogo
        />
      }
    ></PublicDoubleColumnLayout>
  );
};

Page.getInitialProps = async (ctx) => {
  const { wikiId, documentId } = ctx.query;
  return { wikiId, documentId } as IProps;
};

export default Page;
