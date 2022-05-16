import { Icon } from '@douyinfe/semi-ui';
import React from 'react';

export const IconSearch: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="18" height="18" viewBox="0 0 24 24" role="presentation">
          <path
            d="M16.473 17.887A9.46 9.46 0 0 1 10.5 20a9.5 9.5 0 1 1 9.5-9.5 9.46 9.46 0 0 1-2.113 5.973l3.773 3.773a.996.996 0 0 1-.007 1.407.996.996 0 0 1-1.407.007l-3.773-3.773ZM18 10.5a7.5 7.5 0 1 0-15 0 7.5 7.5 0 0 0 15 0Z"
            fill="currentColor"
          ></path>
        </svg>
      }
    />
  );
};
