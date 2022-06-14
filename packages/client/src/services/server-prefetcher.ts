import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from 'react-query';

type PrefetchActions = Array<{
  url: string | (string | number)[];
  action: (cookie: string) => void;
  ignoreCookie?: boolean;
}>;

export async function serverPrefetcher(ctx: NextPageContext, actions: PrefetchActions) {
  const cookie = ctx.req?.headers?.cookie;

  if (!cookie && !actions.filter((action) => action.ignoreCookie === true).length) {
    return {};
  }

  try {
    const queryClient = new QueryClient();

    await Promise.all(
      actions.map((action) => {
        return queryClient.prefetchQuery(action.url, () => action.action(cookie));
      })
    );

    return {
      dehydratedState: dehydrate(queryClient),
    };
  } catch (err) {
    return {};
  }
}
