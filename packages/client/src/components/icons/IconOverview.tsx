import { Icon } from '@douyinfe/semi-ui';
import React from 'react';

export const IconOverview: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="24" height="24" viewBox="0 0 24 24" role="presentation">
          <path
            d="M8.01 18c.546 0 .99-.444.99-1a1 1 0 00-.99-1H3.99A.993.993 0 003 17a1 1 0 00.99 1h4.02zM3 7c0 .552.445 1 .993 1h16.014A.994.994 0 0021 7c0-.552-.445-1-.993-1H3.993A.994.994 0 003 7zm10.998 6A.999.999 0 0015 12c0-.552-.456-1-1.002-1H4.002A.999.999 0 003 12c0 .552.456 1 1.002 1h9.996z"
            fill="currentColor"
            fillRule="evenodd"
          ></path>
        </svg>
      }
    />
  );
};
