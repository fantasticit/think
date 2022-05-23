import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from 'react-query';

type PrefetchActions = Array<{
  url: string;
  action: (cookie: string) => void;
}>;

export async function serverPrefetcher(ctx: NextPageContext, actions: PrefetchActions) {
  const cookie = ctx.req?.headers?.cookie;

  if (!cookie) return {};

  const queryClient = new QueryClient();

  await Promise.all(
    actions.map((action) => {
      return queryClient.prefetchQuery(action.url, () => action.action(cookie));
    })
  );

  return {
    dehydratedState: dehydrate(queryClient),
  };
}
