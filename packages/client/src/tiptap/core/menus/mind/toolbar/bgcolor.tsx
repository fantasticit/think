import { IconMark } from '@douyinfe/semi-icons';
import { Button, Tooltip } from '@douyinfe/semi-ui';
import { ColorPicker } from 'components/color-picker';

export const BgColor = ({ bgColor, selectedNode, setBackgroundColor }) => {
  return (
    <ColorPicker
      onSetColor={(color) => {
        setBackgroundColor(color);
      }}
    >
      <Tooltip content="背景色" zIndex={10000}>
        <Button
          disabled={!selectedNode}
          type="tertiary"
          theme={bgColor ? 'light' : 'borderless'}
          icon={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <IconMark />
              <span
                style={{
                  width: 12,
                  height: 2,
                  backgroundColor: bgColor,
                }}
              ></span>
            </div>
          }
        />
      </Tooltip>
    </ColorPicker>
  );
};
