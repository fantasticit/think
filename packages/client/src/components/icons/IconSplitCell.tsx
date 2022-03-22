import { Icon } from '@douyinfe/semi-ui';

export const IconSplitCell: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
          <path d="M810.016 598.016h86.016v256h-768v-256h86.016v170.016h596v-170.016zM128 170.016v256h86.016V256h596v170.016h86.016v-256h-768z m342.016 300v84h-128v86.016l-128-128 128-128v86.016h128z m212 0V384l128 128-128 128v-86.016h-128v-84h128z"></path>
        </svg>
      }
    />
  );
};
