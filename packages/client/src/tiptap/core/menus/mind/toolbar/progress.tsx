import { IconDuration } from '@douyinfe/semi-icons';
import { Button, Dropdown, Tooltip } from '@douyinfe/semi-ui';

import { PROGRESSES } from '../constant';

export const Progress = ({ selectedNode, setProgress }) => {
  return (
    <Dropdown
      trigger="click"
      render={
        <Dropdown.Menu>
          {PROGRESSES.map((progress) => {
            return (
              <Dropdown.Item key={progress.value} onClick={setProgress(progress.value)}>
                {progress.text}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      }
    >
      <span>
        <Tooltip content="进度" zIndex={10000}>
          <Button size="small" theme="borderless" type="tertiary" disabled={!selectedNode} icon={<IconDuration />} />
        </Tooltip>
      </span>
    </Dropdown>
  );
};
