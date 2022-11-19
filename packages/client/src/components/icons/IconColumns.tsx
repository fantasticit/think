import { Icon } from '@douyinfe/semi-ui';

export const IconAddColBefore: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
          <path fill="none" d="M0 0H24V24H0z" />
          <path d="M20 3c.552 0 1 .448 1 1v16c0 .552-.448 1-1 1h-6c-.552 0-1-.448-1-1V4c0-.552.448-1 1-1h6zm-1 2h-4v14h4V5zM6 7c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5 5-5zm1 2H5v1.999L3 11v2l2-.001V15h2v-2.001L9 13v-2l-2-.001V9z" />
        </svg>
      }
    />
  );
};

export const IconAddColAfter: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
          <path fill="none" d="M0 0H24V24H0z" />
          <path d="M10 3c.552 0 1 .448 1 1v16c0 .552-.448 1-1 1H4c-.552 0-1-.448-1-1V4c0-.552.448-1 1-1h6zM9 5H5v14h4V5zm9 2c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5 5-5zm1 2h-2v1.999L15 11v2l2-.001V15h2v-2.001L21 13v-2l-2-.001V9z" />
        </svg>
      }
    />
  );
};

export const IconDeleteCol: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
          <path fill="none" d="M0 0H24V24H0z" />
          <path d="M12 3c.552 0 1 .448 1 1v8c.835-.628 1.874-1 3-1 2.761 0 5 2.239 5 5s-2.239 5-5 5c-1.032 0-1.99-.313-2.787-.848L13 20c0 .552-.448 1-1 1H6c-.552 0-1-.448-1-1V4c0-.552.448-1 1-1h6zm-1 2H7v14h4V5zm8 10h-6v2h6v-2z" />
        </svg>
      }
    />
  );
};
