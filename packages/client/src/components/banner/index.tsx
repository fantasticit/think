import React, { useEffect, useRef } from 'react';
import { Banner as SemiBanner } from '@douyinfe/semi-ui';
import { BannerProps } from '@douyinfe/semi-ui/banner';
import { useToggle } from 'hooks/use-toggle';

interface IProps extends BannerProps {
  duration?: number;
}

export const Banner: React.FC<IProps> = ({ type, description, duration }) => {
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
  }, [duration]);

  if (!visible) return null;

  return <SemiBanner type={type} description={description} />;
};
