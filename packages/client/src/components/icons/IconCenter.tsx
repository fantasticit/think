import { Icon } from '@douyinfe/semi-ui';

export const IconCenter: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="24" height="24" role="presentation">
          <path
            d="M6 17h12a1 1 0 010 2H6a1 1 0 010-2zm4-8h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4a1 1 0 011-1zM6 5h12a1 1 0 010 2H6a1 1 0 110-2z"
            fill="currentColor"
            fillRule="evenodd"
          ></path>
        </svg>
      }
    />
  );
};
