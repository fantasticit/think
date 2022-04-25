import { Icon } from '@douyinfe/semi-ui';

export const IconCallout: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <path d="M4 2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4Zm16 2v6H4V4h16ZM3 16a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm1 4a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2H4Z"></path>
        </svg>
      }
    />
  );
};
