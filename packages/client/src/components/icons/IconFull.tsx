import { Icon } from '@douyinfe/semi-ui';

export const IconFull: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="24" height="24" viewBox="0 0 24 24" role="presentation">
          <path
            d="M18.062 11L16.5 9.914A1 1 0 1117.914 8.5l2.616 2.616c.28.167.47.5.47.884s-.19.717-.47.884L17.914 15.5a1 1 0 01-1.414-1.414L18.062 13h-3.68c-.487 0-.882-.448-.882-1s.395-1 .882-1h3.68zM3.47 12.884c-.28-.167-.47-.5-.47-.884s.19-.717.47-.884L6.086 8.5A1 1 0 017.5 9.914L5.938 11h3.68c.487 0 .882.448.882 1s-.395 1-.882 1h-3.68L7.5 14.086A1 1 0 016.086 15.5L3.47 12.884z"
            fill="currentColor"
          ></path>
        </svg>
      }
    />
  );
};
