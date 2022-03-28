import { Icon } from '@douyinfe/semi-ui';

export const IconTask: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="16" height="16" viewBox="0 0 256 256" role="presentation">
          <g fill="none" fillRule="evenodd">
            <path
              d="M169.002 89.757c3.945-3.865 10.276-3.8 14.141.145 3.795 3.873 3.801 10.047.067 13.928l-.212.213-63.285 62a10 10 0 0 1-13.776.209l-.219-.208-32.715-32.041c-3.946-3.865-4.012-10.196-.147-14.142 3.794-3.873 9.966-4.007 13.924-.354l.217.207 25.717 25.187 56.288-55.144Z"
              fill="currentColor"
              fillRule="nonzero"
            ></path>
            <path
              d="M201 23c17.673 0 32 14.327 32 32v146c0 17.673-14.327 32-32 32H55c-17.673 0-32-14.327-32-32V55c0-17.673 14.327-32 32-32h146Zm0 20H55c-6.525 0-11.834 5.209-11.996 11.695L43 55v146c0 6.525 5.209 11.834 11.695 11.996L55 213h146c6.525 0 11.834-5.209 11.996-11.695L213 201V55c0-6.525-5.209-11.834-11.695-11.996L201 43Z"
              fill="currentColor"
              fillRule="nonzero"
            ></path>
          </g>
        </svg>
      }
    />
  );
};
