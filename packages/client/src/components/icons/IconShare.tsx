import { Icon } from '@douyinfe/semi-ui';
import React from 'react';

export const IconShare: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="16" height="16" viewBox="0 0 24 24" role="presentation">
          <g fill="currentColor" fillRule="evenodd">
            <path
              d="M6 15a3 3 0 100-6 3 3 0 000 6zm0-2a1 1 0 110-2 1 1 0 010 2zm12-4a3 3 0 100-6 3 3 0 000 6zm0-2a1 1 0 110-2 1 1 0 010 2zm0 14a3 3 0 100-6 3 3 0 000 6zm0-2a1 1 0 110-2 1 1 0 010 2z"
              fillRule="nonzero"
            ></path>
            <path d="M7 13.562l8.66 5 1-1.732-8.66-5z"></path>
            <path d="M7 10.83l1 1.732 8.66-5-1-1.732z"></path>
          </g>
        </svg>
      }
    />
  );
};
