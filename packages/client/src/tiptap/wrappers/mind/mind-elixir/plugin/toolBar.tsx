import ReactDOM from 'react-dom';
import { Button, Space, Toast } from '@douyinfe/semi-ui';
import {
  IconMindLeft,
  IconMindRight,
  IconMindSide,
  IconMindFull,
  IconMindCenter,
  IconZoomOut,
  IconZoomIn,
} from 'components/icons';
import { Divider } from 'tiptap/divider';

function Operation({ mind }) {
  return (
    <Space spacing={2}>
      <Button
        type="tertiary"
        theme="borderless"
        size="small"
        onClick={() => {
          if (!mind.container.requestFullscreen) {
            Toast.error('当前浏览器不支持全屏');
            return;
          }
          mind.container.requestFullscreen();
        }}
        icon={<IconMindFull style={{ fontSize: '0.85em' }} />}
      />

      <Button
        type="tertiary"
        theme="borderless"
        size="small"
        onClick={() => {
          mind.toCenter();
        }}
        icon={<IconMindCenter style={{ fontSize: '0.85em' }} />}
      />

      <Button
        type="tertiary"
        theme="borderless"
        size="small"
        onClick={() => {
          if (mind.scaleVal < 0.6) return;
          mind.scale((mind.scaleVal -= 0.2));
        }}
        icon={<IconZoomOut style={{ fontSize: '0.85em' }} />}
      />

      <Button
        type="tertiary"
        theme="borderless"
        size="small"
        onClick={() => {
          if (mind.scaleVal > 1.6) return;
          mind.scale((mind.scaleVal += 0.2));
        }}
        icon={<IconZoomIn style={{ fontSize: '0.85em' }} />}
      />

      <Divider />

      <Button
        type="tertiary"
        theme="borderless"
        size="small"
        onClick={() => {
          mind.initLeft();
        }}
        icon={<IconMindLeft style={{ fontSize: '0.85em' }} />}
      />

      <Button
        type="tertiary"
        theme="borderless"
        size="small"
        onClick={() => {
          mind.initRight();
        }}
        icon={<IconMindRight style={{ fontSize: '0.85em' }} />}
      />

      <Button
        type="tertiary"
        theme="borderless"
        size="small"
        onClick={() => {
          mind.initSide();
        }}
        icon={<IconMindSide style={{ fontSize: '0.85em' }} />}
      />
    </Space>
  );
}

export default function (mind) {
  const div = document.createElement('div');
  div.className = 'toolbar rb';
  ReactDOM.render(<Operation mind={mind} />, div);
  mind.container.append(div);
}
