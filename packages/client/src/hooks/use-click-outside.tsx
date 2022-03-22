import { useEffect } from 'react';

export function useClickOutside(ref, handler: { in?: (evt: MouseEvent) => void; out?: (evt: MouseEvent) => void }) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        handler.in && handler.in(event);
      } else {
        handler.out && handler.out(event);
      }
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
