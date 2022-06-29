import { IWiki, WikiApiDefinition } from '@think/domains';
import { WikiSetting } from 'components/wiki/setting';
import { WikiTocs } from 'components/wiki/tocs';
import { getWikiMembers, getWikiTocs } from 'data/wiki';
import { AppDoubleColumnLayout } from 'layouts/app-double-column';
import { NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { serverPrefetcher } from 'services/server-prefetcher';

interface IProps {
  wikiId: string;
}

const Page: NextPage<IProps> = ({ wikiId }) => {
  const { query = {} } = useRouter();
  const { tab = 'recent' } = query as {
    tab?: string;
  };

  const navigate = useCallback(
    (tab = 'base') => {
      return () => {
        Router.push({
          pathname: `/app/org/[organizationId]/wiki/[wikiId]/setting`,
          query: { organizationId: query.organizationId, wikiId, tab },
        });
      };
    },
    [query, wikiId]
  );

  return (
    <AppDoubleColumnLayout
      leftNode={<WikiTocs wikiId={wikiId} />}
      rightNode={
        <div style={{ padding: '16px 24px' }}>
          <WikiSetting wikiId={wikiId} tab={tab} onNavigate={(tab) => navigate(tab)()} />
        </div>
      }
    />
  );
};

Page.getInitialProps = async (ctx) => {
  const { wikiId } = ctx.query;
  const res = await serverPrefetcher(ctx, [
    {
      url: WikiApiDefinition.getTocsById.client(wikiId as IWiki['id']),
      action: (cookie) => getWikiTocs(wikiId, cookie),
    },
    {
      url: WikiApiDefinition.getMemberById.client(wikiId as IWiki['id']),
      action: (cookie) => getWikiMembers(wikiId, cookie),
    },
  ]);
  return { ...res, wikiId } as IProps;
};

export default Page;
