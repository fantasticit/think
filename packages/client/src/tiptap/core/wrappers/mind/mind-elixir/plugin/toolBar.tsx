import ReactDOM from 'react-dom';
import cls from 'classnames';
import { Button, Space, Toast } from '@douyinfe/semi-ui';
import { IconDoubleChevronRight, IconDoubleChevronLeft } from '@douyinfe/semi-icons';
import {
  IconMindLeft,
  IconMindRight,
  IconMindSide,
  IconMindFull,
  IconMindCenter,
  IconZoomOut,
  IconZoomIn,
} from 'components/icons';
import { Divider } from 'tiptap/components/divider';
import { useToggle } from 'hooks/use-toggle';
import { useMemo } from 'react';

function Operation({ mind }) {
  const [visible, toggleVisible] = useToggle(true);
  const CollpaseIcon = useMemo(() => (visible ? IconDoubleChevronRight : IconDoubleChevronLeft), [visible]);

  return (
    <>
      <div className={cls('toolbar rb1', visible && 'is-visible')}>
        <Space spacing={2}>
          {/* <Button
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
          /> */}

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
      </div>
      <div className="toolbar rb2">
        <Button
          type="tertiary"
          theme="borderless"
          size="small"
          onClick={toggleVisible}
          icon={<CollpaseIcon style={{ fontSize: '0.85em' }} />}
        />
      </div>
    </>
  );
}

export default function (mind) {
  const div = document.createElement('div');
  // div.className = 'toolbar rb';
  ReactDOM.render(<Operation mind={mind} />, div);
  mind.container.append(div);
}
