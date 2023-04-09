import { Icon } from '@douyinfe/semi-ui';

export const IconLineHeight: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="16" height="16" viewBox="0 0 24 24" role="presentation">
          <path
            d="M11 4H21V6H11V4ZM6 7V11H4V7H1L5 3L9 7H6ZM6 17H9L5 21L1 17H4V13H6V17ZM11 18H21V20H11V18ZM9 11H21V13H9V11Z"
            fill="currentColor"
          ></path>
        </svg>
      }
    />
  );
};
