import { IconClock } from '@douyinfe/semi-icons';
import { Button, Dropdown, Tooltip } from '@douyinfe/semi-ui';

import { PRIORITIES } from '../constant';

export const Priority = ({ selectedNode, setPriority }) => {
  return (
    <Dropdown
      trigger="click"
      render={
        <Dropdown.Menu>
          {PRIORITIES.map((item) => {
            return (
              <Dropdown.Item key={item.value} onClick={setPriority(item.value)}>
                {item.text}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      }
    >
      <span>
        <Tooltip content="优先级" zIndex={10000}>
          <Button size="small" theme="borderless" type="tertiary" disabled={!selectedNode} icon={<IconClock />} />
        </Tooltip>
      </span>
    </Dropdown>
  );
};
