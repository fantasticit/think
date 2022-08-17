import { Icon } from '@douyinfe/semi-ui';

export const IconLayout: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="18" height="18" viewBox="0 0 24 24" role="presentation">
          <g fill="none" fillRule="evenodd">
            <path
              d="M5 5h5a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1zm9 0h5a1 1 0 011 1v12a1 1 0 01-1 1h-5a1 1 0 01-1-1V6a1 1 0 011-1z"
              fill="currentColor"
              fillRule="nonzero"
            ></path>
          </g>
        </svg>
      }
    />
  );
};
