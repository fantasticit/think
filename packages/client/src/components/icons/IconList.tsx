import { Icon } from '@douyinfe/semi-ui';

export const IconList: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="16" height="16" viewBox="0 0 256 256" role="presentation">
          <g fill="currentColor" fillRule="evenodd">
            <g fillRule="nonzero">
              <path d="M215 118c5.523 0 10 4.477 10 10 0 5.43-4.327 9.848-9.72 9.996L215 138H96c-5.523 0-10-4.477-10-10 0-5.43 4.327-9.848 9.72-9.996L96 118h119ZM215 35c5.523 0 10 4.477 10 10 0 5.43-4.327 9.848-9.72 9.996L215 55H96c-5.523 0-10-4.477-10-10 0-5.43 4.327-9.848 9.72-9.996L96 35h119ZM215 201c5.523 0 10 4.477 10 10 0 5.43-4.327 9.848-9.72 9.996L215 221H96c-5.523 0-10-4.477-10-10 0-5.43 4.327-9.848 9.72-9.996L96 201h119Z"></path>
            </g>
            <circle cx="44" cy="45" r="16"></circle>
            <circle cx="44" cy="128" r="16"></circle>
            <circle cx="44" cy="211" r="16"></circle>
          </g>
        </svg>
      }
    />
  );
};
