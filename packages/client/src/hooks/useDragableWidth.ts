import { useEffect, useRef } from "react";
import useSWR from "swr";
import { useWindowSize } from "hooks/useWindowSize";
import { setStorage, getStorage } from "helpers/storage";

const key = "dragable-menu-width";
export const MIN_WIDTH = 240;
export const MAX_WIDTH = 600;

const COLLAPSED_WIDTH = 24;

export const useDragableWidth = () => {
  const runTimeWidthRef = useRef(null);
  const { data, mutate } = useSWR<number>(key, getStorage);
  const windowSize = useWindowSize();
  const isCollapsed = data <= COLLAPSED_WIDTH;

  const updateWidth = (size) => {
    setStorage(key, size);
    mutate();
    runTimeWidthRef.current = size;
  };

  const toggleCollapsed = (collapsed = null) => {
    const isBool = typeof collapsed === "boolean";
    const nextCollapsed = isBool ? collapsed : !isCollapsed;
    let nextWidth = nextCollapsed ? COLLAPSED_WIDTH : MIN_WIDTH;
    setStorage(key, nextWidth);
    mutate();
    runTimeWidthRef.current = nextWidth;
  };

  useEffect(() => {
    mutate();

    return () => {
      runTimeWidthRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!windowSize.width) return;
    toggleCollapsed(windowSize.width <= 765);
  }, [windowSize.width]);

  return {
    width: data,
    isCollapsed,
    toggleCollapsed,
    updateWidth,
  };
};
