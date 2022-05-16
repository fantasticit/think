import { Tooltip as SemiTooltip } from '@douyinfe/semi-ui';
import { Position } from '@douyinfe/semi-ui/tooltip';
import { useToggle } from 'hooks/use-toggle';
import React from 'react';

interface IProps {
  content: React.ReactNode;
  hideOnClick?: boolean;
  position?: Position;
}

export const Tooltip: React.FC<IProps> = ({ content, hideOnClick = false, position = 'top', children }) => {
  const [visible, toggleVisible] = useToggle(false);

  return (
    <SemiTooltip visible={visible} content={content} zIndex={10000} trigger={'custom'} position={position}>
      <span
        onMouseEnter={() => {
          toggleVisible(true);
        }}
        onMouseLeave={() => {
          toggleVisible(false);
        }}
        onMouseDown={() => {
          hideOnClick && toggleVisible(false);
        }}
      >
        {children}
      </span>
    </SemiTooltip>
  );
};
