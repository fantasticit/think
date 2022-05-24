import { ITemplate, TemplateApiDefinition } from '@think/domains';
import { TemplateEditor } from 'components/template/editor';
import { getTemplateDetail } from 'data/template';
import { NextPage } from 'next';
import { serverPrefetcher } from 'services/server-prefetcher';

interface IProps {
  templateId: string;
}

const Page: NextPage<IProps> = ({ templateId }) => {
  return <TemplateEditor templateId={templateId} />;
};

Page.getInitialProps = async (ctx) => {
  const { templateId } = ctx.query;
  const res = await serverPrefetcher(ctx, [
    {
      url: TemplateApiDefinition.getDetailById.client(templateId as ITemplate['id']),
      action: (cookie) => getTemplateDetail(templateId, cookie),
    },
  ]);
  return { ...res, templateId } as IProps;
};

export default Page;
