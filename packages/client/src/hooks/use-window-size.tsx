import { useEffect, useState } from 'react';

interface Size {
  width: number | undefined;
  height: number | undefined;
  isMobile: boolean;
}

const PC_MOBILE_CRITICAL_WIDTH = 765;

export function useWindowSize(): Size {
  const [windowSize, setWindowSize] = useState<Size>({
    width: undefined,
    height: undefined,
    isMobile: false,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= PC_MOBILE_CRITICAL_WIDTH,
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
