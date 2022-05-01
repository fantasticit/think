import React, { useEffect, useRef } from 'react';
import { useToggle } from 'hooks/use-toggle';

interface IProps {
  loading: boolean;
  delay?: number;
  loadingContent: React.ReactElement;
  normalContent: React.ReactElement;
}

export const LoadingWrap: React.FC<IProps> = ({ loading, delay = 200, loadingContent, normalContent }) => {
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
    return showLoading ? loadingContent : null;
  }

  return normalContent;
};
