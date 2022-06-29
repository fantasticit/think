import { Router, useRouter } from 'next/router';

export function useRouterQuery<T extends Router['query']>() {
  const router = useRouter();

  return router.query as T;
}
