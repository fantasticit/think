import { useCallback, useEffect, useRef, useState } from 'react';

type PromiseAction = (...args: any[]) => Promise<any>;

export function useAsyncLoading<A extends PromiseAction>(action: A, wait = 200, initialLoading = false): [A, boolean] {
  const timerRef = useRef<any>(null);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(initialLoading);

  const actionWithPending = useCallback(
    (...args: Parameters<A>) => {
      setPending(true);
      const promise = action(...args);
      promise.then(
        () => setPending(false),
        () => setPending(false)
      );
      return promise;
    },
    [action]
  );

  useEffect(() => {
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setLoading(pending);
    }, wait);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [wait, pending]);

  return [actionWithPending as A, loading];
}
