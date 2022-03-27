import { useEffect } from 'react';
import Viewer from 'viewerjs';

interface IProps {
  containerSelector: string;
}

export const ImageViewer: React.FC<IProps> = ({ containerSelector }) => {
  useEffect(() => {
    const el = document.querySelector(containerSelector);
    if (!el) {
      return null;
    }
    const viewer = new Viewer(el as HTMLElement, { inline: false });
    const io = new MutationObserver(() => {
      viewer.update();
    });
    io.observe(el, {
      childList: true,
      subtree: true,
    });

    return () => {
      io.disconnect();
      viewer.destroy();
    };
  }, [containerSelector]);

  return null;
};
