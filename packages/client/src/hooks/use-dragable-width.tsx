import { clamp } from 'helpers/clamp';
import { getStorage, setStorage } from 'helpers/storage';
import { useCallback, useMemo, useRef } from 'react';
import { useQuery } from 'react-query';

import { IsOnMobile } from './use-on-mobile';

const key = 'dragable-menu-width';

const DEFAULT_PC_MIN_WIDTH = 240;
const DEFAULT_PC_MAX_WIDTH = 600;

const DEFAULT_MOBILE_MIN_WIDTH = 24;
const DEFAULT_MOBILE_MAX_WIDTH = 240;

// 收起宽度：24
const COLLAPSED_WIDTH = 24;

export const useDragableWidth = () => {
  const { isMobile } = IsOnMobile.useHook();
  const [minWidth, maxWidth] = useMemo(
    () =>
      isMobile ? [DEFAULT_MOBILE_MIN_WIDTH, DEFAULT_MOBILE_MAX_WIDTH] : [DEFAULT_PC_MIN_WIDTH, DEFAULT_PC_MAX_WIDTH],
    [isMobile]
  );
  const { data: currentWidth, refetch } = useQuery<number>(key, () => {
    const nextWidth = getStorage(key, minWidth);

    if (nextWidth <= COLLAPSED_WIDTH) {
      return COLLAPSED_WIDTH;
    }

    return clamp(nextWidth, minWidth, maxWidth);
  });
  const prevWidthRef = useRef<number>(maxWidth);

  const updateWidth = useCallback(
    (size) => {
      if (isMobile && size < maxWidth) {
        size = minWidth;
      }
      setStorage(key, size);
      prevWidthRef.current = size;
      refetch();
    },
    [isMobile, minWidth, maxWidth, refetch]
  );

  const toggleCollapsed = useCallback(() => {
    const isCollapsed = currentWidth <= COLLAPSED_WIDTH;

    if (!isCollapsed) {
      prevWidthRef.current = currentWidth;
      setStorage(key, COLLAPSED_WIDTH);
    } else {
      let nextWidth = prevWidthRef.current;

      if (nextWidth >= maxWidth) {
        nextWidth = maxWidth;
      }

      if (nextWidth <= minWidth) {
        nextWidth = minWidth;
      }

      setStorage(key, nextWidth);
    }
    refetch();
  }, [refetch, currentWidth, minWidth, maxWidth]);

  return {
    minWidth,
    maxWidth,
    width: currentWidth,
    isCollapsed: currentWidth <= COLLAPSED_WIDTH,
    toggleCollapsed,
    updateWidth,
  };
};
