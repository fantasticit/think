import { Icon } from '@douyinfe/semi-ui';

export const IconLeft: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="24" height="24" role="presentation">
          <path
            d="M6 17h12a1 1 0 010 2H6a1 1 0 010-2zm0-8h4a1 1 0 011 1v4a1 1 0 01-1 1H6a1 1 0 01-1-1v-4a1 1 0 011-1zm0-4h12a1 1 0 010 2H6a1 1 0 110-2z"
            fill="currentColor"
            fillRule="evenodd"
          ></path>
        </svg>
      }
    />
  );
};
