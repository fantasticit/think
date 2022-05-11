import { Icon } from '@douyinfe/semi-ui';

export const IconFlow: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="16" height="16" viewBox="0 0 24 24" role="presentation">
          <path
            d="M15.722 1.55a2 2 0 0 1 2.828 0l3.536 3.536a2 2 0 0 1 0 2.828L18.55 11.45a2 2 0 0 1-2.828 0l-3.536-3.536a2.003 2.003 0 0 1-.318-.414H7.5a1 1 0 0 0-1 1V16a1 1 0 0 0 1 1H11v-1a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-1H7.5a3 3 0 0 1-3-3v-3.181H1.91a.91.91 0 1 1 0-1.819H4.5V8.5a3 3 0 0 1 3-3h4.368c.085-.148.192-.288.318-.414l3.536-3.536Zm1.414 1.414L13.601 6.5l3.535 3.536L20.672 6.5l-3.536-3.536ZM20 16h-7v4h7v-4Z"
            fill="currentColor"
          ></path>
        </svg>
      }
    />
  );
};
