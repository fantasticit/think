import { useRouter } from 'next/router';

export function useRouterQuery<T>() {
  const router = useRouter();
  return router.query as unknown as T;
}
