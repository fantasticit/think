import { createGlobalHook } from './create-global-hook';
import { useToggle } from './use-toggle';

const useOnMobile = (defaultIsMobile) => {
  const [isMobile, toggleIsMobile] = useToggle(defaultIsMobile);
  return {
    isMobile,
    toggleIsMobile,
  };
};

export const IsOnMobile = createGlobalHook<{ isMobile?: boolean; toggle: () => void }, boolean>(useOnMobile);
