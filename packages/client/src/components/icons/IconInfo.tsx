import { Icon } from '@douyinfe/semi-ui';

export const IconInfo: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="16" height="16" viewBox="0 0 256 256" role="presentation">
          <g fill="none" fillRule="evenodd">
            <path
              d="M197 27c17.673 0 32 14.327 32 32v138c0 17.673-14.327 32-32 32H59c-17.673 0-32-14.327-32-32V59c0-17.673 14.327-32 32-32h138Zm0 20H59c-6.525 0-11.834 5.209-11.996 11.695L47 59v138c0 6.525 5.209 11.834 11.695 11.996L59 209h138c6.525 0 11.834-5.209 11.996-11.695L209 197V59c0-6.525-5.209-11.834-11.695-11.996L197 47Z"
              fill="currentColor"
              fillRule="nonzero"
            ></path>
          </g>
        </svg>
      }
    />
  );
};
