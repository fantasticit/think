import { Icon } from '@douyinfe/semi-ui';

export const IconTableHeaderColumn: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <path d="M64 960l896 0L960 64 64 64 64 960zM640 384l0 256L384 640 384 384 640 384zM384 896l0-192 256 0 0 192L384 896zM320 896 258.88 896 320 834.88 320 896zM320 744.384 168.384 896 128 896l0-76.096 192-192L320 744.384zM128 729.344 128 611.904l192-192 0 117.504L128 729.344zM128 521.344 128 403.904l192-192 0 117.504L128 521.344zM128 313.344 128 227.904 227.904 128l85.504 0L128 313.344zM896 896l-192 0 0-192 192 0L896 896zM896 640l-192 0L704 384l192 0L896 640zM896 128l0 192-192 0L704 128 896 128zM640 320 384 320 384 128l256 0L640 320z"></path>
        </svg>
      }
    />
  );
};
