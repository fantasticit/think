import { clamp } from 'helpers/clamp';
import { getStorage, setStorage } from 'helpers/storage';
import { useWindowSize } from 'hooks/use-window-size';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';

const key = 'dragable-menu-width';

const DEFAULT_PC_MIN_WIDTH = 240;
const DEFAULT_PC_MAX_WIDTH = 600;

const DEFAULT_MOBILE_MIN_WIDTH = 24;
const DEFAULT_MOBILE_MAX_WIDTH = 240;

// 收起宽度：24
const COLLAPSED_WIDTH = 24;

const PC_MOBILE_CRITICAL_WIDTH = 765;

export const useDragableWidth = () => {
  const { width: windowWidth } = useWindowSize();
  const [minWidth, setMinWidth] = useState(DEFAULT_MOBILE_MIN_WIDTH);
  const [maxWidth, setMaxWidth] = useState(DEFAULT_MOBILE_MAX_WIDTH);
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
      const isMobile = windowWidth <= PC_MOBILE_CRITICAL_WIDTH;

      if (isMobile && size < maxWidth) {
        size = minWidth;
      }
      setStorage(key, size);
      prevWidthRef.current = size;
      refetch();
    },
    [refetch, windowWidth, minWidth, maxWidth]
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

  useEffect(() => {
    const min = windowWidth <= PC_MOBILE_CRITICAL_WIDTH ? DEFAULT_MOBILE_MIN_WIDTH : DEFAULT_PC_MIN_WIDTH;
    const max = windowWidth <= PC_MOBILE_CRITICAL_WIDTH ? DEFAULT_MOBILE_MAX_WIDTH : DEFAULT_PC_MAX_WIDTH;
    setMinWidth(min);
    setMaxWidth(max);
  }, [windowWidth, refetch, currentWidth]);

  return {
    minWidth,
    maxWidth,
    width: currentWidth,
    isCollapsed: currentWidth <= COLLAPSED_WIDTH,
    toggleCollapsed,
    updateWidth,
  };
};
