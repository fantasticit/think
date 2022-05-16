import { IconClose } from '@douyinfe/semi-icons';
import { Banner as SemiBanner } from '@douyinfe/semi-ui';
import { BannerProps } from '@douyinfe/semi-ui/banner';
import { useToggle } from 'hooks/use-toggle';
import React, { useEffect, useRef } from 'react';

interface IProps extends BannerProps {
  duration?: number;
  closeable?: boolean;
}

export const Banner: React.FC<IProps> = ({ type, description, duration = 0, closeable = true }) => {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [visible, toggleVisible] = useToggle(true);

  useEffect(() => {
    clearTimeout(timer.current);
    if (duration <= 0) return;

    timer.current = setTimeout(() => {
      toggleVisible(false);
    }, duration);

    return () => {
      clearTimeout(timer.current);
    };
  }, [duration, toggleVisible]);

  if (!visible) return null;

  return <SemiBanner type={type} description={description} closeIcon={closeable ? <IconClose /> : null} />;
};
