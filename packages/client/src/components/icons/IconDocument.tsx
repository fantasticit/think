import { Icon } from '@douyinfe/semi-ui';
import React from 'react';

export const IconDocument: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg height="16" width="16" viewBox="0 0 24 24" focusable="false">
          <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
            <path
              transform="translate(2 2)"
              d="M3.5 0C1.84315 0 0.5 1.34315 0.5 3V17C0.5 18.6569 1.84315 20 3.5 20H17.5C19.1569 20 20.5 18.6569 20.5 17V3C20.5 1.34315 19.1569 0 17.5 0H3.5ZM2.5 3C2.5 2.44772 2.94772 2 3.5 2H17.5C18.0523 2 18.5 2.44772 18.5 3V17C18.5 17.5523 18.0523 18 17.5 18H3.5C2.94772 18 2.5 17.5523 2.5 17V3ZM5.5 5C4.94772 5 4.5 5.44772 4.5 6C4.5 6.55228 4.94771 7 5.5 7H15.5C16.0523 7 16.5 6.55228 16.5 6C16.5 5.44772 16.0523 5 15.5 5H5.5ZM4.5 10C4.5 9.44771 4.94772 9 5.5 9H15.5C16.0523 9 16.5 9.44771 16.5 10C16.5 10.5523 16.0523 11 15.5 11H5.5C4.94771 11 4.5 10.5523 4.5 10ZM5.5 13C4.94772 13 4.5 13.4477 4.5 14C4.5 14.5523 4.94772 15 5.5 15H11.5C12.0523 15 12.5 14.5523 12.5 14C12.5 13.4477 12.0523 13 11.5 13H5.5Z"
            ></path>
          </g>
        </svg>
      }
    />
  );
};
