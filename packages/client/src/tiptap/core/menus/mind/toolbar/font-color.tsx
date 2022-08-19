import { IconFont } from '@douyinfe/semi-icons';
import { Button, Tooltip } from '@douyinfe/semi-ui';
import { ColorPicker } from 'components/color-picker';

export const FontColor = ({ selectedNode, setFontColor, textColor }) => {
  return (
    <ColorPicker
      onSetColor={(color) => {
        setFontColor(color);
      }}
    >
      <Tooltip content="文本色" zIndex={10000}>
        <Button
          disabled={!selectedNode}
          type="tertiary"
          theme={textColor ? 'light' : 'borderless'}
          icon={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <IconFont />
              <span
                style={{
                  width: 12,
                  height: 2,
                  backgroundColor: textColor,
                }}
              ></span>
            </div>
          }
        />
      </Tooltip>
    </ColorPicker>
  );
};
