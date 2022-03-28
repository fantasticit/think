import { Icon } from '@douyinfe/semi-ui';

export const IconTable: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="16" height="16" viewBox="0 0 256 256" role="presentation">
          <g fill="currentColor" fillRule="evenodd">
            <path
              d="M208 40c17.673 0 32 14.327 32 32v112c0 17.673-14.327 32-32 32H48c-17.673 0-32-14.327-32-32V72c0-17.673 14.327-32 32-32h160Zm0 20H48c-6.525 0-11.834 5.209-11.996 11.695L36 72v112c0 6.525 5.209 11.834 11.695 11.996L48 196h160c6.525 0 11.834-5.209 11.996-11.695L220 184V72c0-6.525-5.209-11.834-11.695-11.996L208 60Z"
              fillRule="nonzero"
            ></path>
            <path d="M28 93h204v20H28zM28 143h204v20H28z"></path>
            <path d="M90 60v137H70V60z"></path>
          </g>
        </svg>
      }
    />
  );
};
