import { Icon } from '@douyinfe/semi-ui';

export const IconHorizontalRule: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="16" height="16" viewBox="0 0 256 256" role="presentation">
          <g fill="none" fillRule="evenodd">
            <rect fill="currentColor" x="17" y="116" width="223" height="24" rx="12"></rect>
          </g>
        </svg>
      }
    />
  );
};
