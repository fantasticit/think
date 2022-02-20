import { NextPage } from "next";
import { DocumentEditor } from "components/document/editor";

interface IProps {
  wikiId: string;
  documentId: string;
}

const Page: NextPage<IProps> = ({ wikiId, documentId }) => {
  return <DocumentEditor key={documentId} documentId={documentId} />;
};

Page.getInitialProps = async (ctx) => {
  const { wikiId, documentId } = ctx.query;
  return { wikiId, documentId } as IProps;
};

export default Page;
