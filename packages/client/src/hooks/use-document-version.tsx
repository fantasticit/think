import { createGlobalHook } from './create-global-hook';
import { useToggle } from './use-toggle';

const useDocumentVersion = (defaultVisible) => {
  const [visible, toggleVisible] = useToggle(defaultVisible);

  return {
    visible,
    toggleVisible,
  };
};

export const DocumentVersionControl = createGlobalHook<
  { visible?: boolean; toggleVisible: (arg?: any) => void },
  boolean
>(useDocumentVersion);
