import { Icon } from '@douyinfe/semi-ui';

export const IconStatus: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="16" height="16" viewBox="0 0 256 256" role="presentation">
          <g transform="rotate(-45 100.071 47.645)" fill="currentColor" fillRule="evenodd">
            <path
              d="m44.625 4.22-47 46.951A26 26 0 0 0-10 69.566V190c0 14.36 11.64 26 26 26h94c14.36 0 26-11.64 26-26V69.566a26 26 0 0 0-7.625-18.395l-47-46.95c-10.151-10.14-26.599-10.14-36.75 0ZM67.24 18.37l47 46.95a6 6 0 0 1 1.76 4.246V190a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V69.566a6 6 0 0 1 1.76-4.245l47-46.95a6 6 0 0 1 8.48 0Z"
              fillRule="nonzero"
            ></path>
            <circle cx="63.172" cy="67.586" r="14"></circle>
          </g>
        </svg>
      }
    />
  );
};
