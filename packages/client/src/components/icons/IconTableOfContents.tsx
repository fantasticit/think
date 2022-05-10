import { Icon } from '@douyinfe/semi-ui';

export const IconTableOfContents: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <Icon
      style={style}
      svg={
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="17" height="17">
          <path
            d="M160 64C107.264 64 64 107.264 64 160v640c0 52.736 43.264 96 96 96h640c52.736 0 96-43.264 96-96v-640c0-52.736-43.264-96-96-96z m0 64h640c17.984 0 32 14.016 32 32v640c0 17.984-14.016 32-32 32h-640a31.616 31.616 0 0 1-32-32v-640c0-17.984 14.016-32 32-32zM256 320v64h448V320z m0 128v64h448V448z m0 128v64h320V576z"
            fill="currentColor"
          ></path>
        </svg>
      }
    />
  );
};
