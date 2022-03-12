import { Icon } from '@douyinfe/semi-ui';

export const IconEmoji: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="24" height="24" viewBox="0 0 24 24" role="presentation">
          <path
            d="M12 5a7 7 0 110 14 7 7 0 010-14zm0 12.5c3.033 0 5.5-2.467 5.5-5.5S15.033 6.5 12 6.5A5.506 5.506 0 006.5 12c0 3.033 2.467 5.5 5.5 5.5zm-1.5-6a1 1 0 110-2 1 1 0 010 2zm3 0a1 1 0 110-2 1 1 0 010 2zm.27 1.583a.626.626 0 01.932.834A3.63 3.63 0 0112 15.125a3.63 3.63 0 01-2.698-1.204.625.625 0 01.93-.835c.901 1.003 2.639 1.003 3.538-.003z"
            fill="currentColor"
            fillRule="evenodd"
          ></path>
        </svg>
      }
    />
  );
};
