import { useEffect } from 'react';
import Viewer from 'viewerjs';

interface IProps {
  containerSelector?: string;
  container?: HTMLElement;
}

export const ImageViewer: React.FC<IProps> = ({ container, containerSelector }) => {
  useEffect(() => {
    const el = container || document.querySelector(containerSelector);
    if (!el) {
      return null;
    }
    const viewer = new Viewer(el, { inline: false });
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
  }, [container, containerSelector]);

  return null;
};
