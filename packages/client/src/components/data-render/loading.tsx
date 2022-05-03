import React, { useEffect, useRef } from 'react';
import { useToggle } from 'hooks/use-toggle';

// interface IProps {
//   loading: boolean;
//   delay?: number;
//   runRender
//   loadingContent: React.ReactElement;
//   normalContent: React.ReactElement;
// }

export const LoadingWrap = ({ loading, delay = 200, runRender, loadingContent, normalContent }) => {
  const timer = useRef<ReturnType<typeof setTimeout>>(null);
  const [showLoading, toggleShowLoading] = useToggle(false);

  useEffect(() => {
    clearTimeout(timer.current);

    if (!loading) return;

    timer.current = setTimeout(() => {
      if (loading) {
        toggleShowLoading(true);
      } else {
        toggleShowLoading(false);
      }
    }, delay);

    return () => {
      clearTimeout(timer.current);
    };
  }, [delay, loading, toggleShowLoading]);

  if (loading) {
    return showLoading ? runRender(loadingContent) : null;
  }

  return runRender(normalContent);
};
