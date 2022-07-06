import { useToggle } from 'hooks/use-toggle';
import React, { useEffect, useRef } from 'react';

import { Render } from './constant';

export const LoadingWrap = ({ loading, delay = 200, loadingContent, normalContent }) => {
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
    return showLoading ? <Render fn={loadingContent} /> : null;
  }

  return <Render fn={normalContent} />;
};
