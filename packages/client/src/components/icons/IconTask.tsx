import { Icon } from "@douyinfe/semi-ui";

export const IconTask: React.FC<{ style?: React.CSSProperties }> = ({
  style = {},
}) => {
  return (
    <Icon
      style={style}
      svg={
        <svg width="24" height="24" viewBox="0 0 24 24" role="presentation">
          <path
            d="M7.5 6h9A1.5 1.5 0 0118 7.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 016 16.5v-9A1.5 1.5 0 017.5 6zm3.072 8.838l.143.154a.5.5 0 00.769-.042l.13-.175 3.733-5.045a.8.8 0 00-.11-1.064.665.665 0 00-.984.118l-3.243 4.387-1.315-1.422a.663.663 0 00-.99 0 .801.801 0 000 1.07l1.867 2.019z"
            fill="currentColor"
            fillRule="evenodd"
          ></path>
        </svg>
      }
    />
  );
};
