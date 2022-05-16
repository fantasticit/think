import { WikiSetting } from 'components/wiki/setting';
import { WikiTocs } from 'components/wiki/tocs';
import { DoubleColumnLayout } from 'layouts/double-column';
import { NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useCallback } from 'react';

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
          pathname: `/wiki/${wikiId}/setting`,
          query: { tab },
        });
      };
    },
    [wikiId]
  );

  return (
    <DoubleColumnLayout
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
  return { wikiId } as IProps;
};

export default Page;
