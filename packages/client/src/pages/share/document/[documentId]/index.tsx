import { NextPage } from "next";
import { DocumentPublicReader } from "components/document/reader/public";

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
