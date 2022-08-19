import { IconHelpCircle } from '@douyinfe/semi-icons';
import { Button, Descriptions, Popover } from '@douyinfe/semi-ui';

import styles from './index.module.scss';

const HELP_MESSAGE = [
  { key: '新增同级节点', value: 'Enter 键' },
  { key: '新增子节点', value: 'Tab 键' },
  { key: '编辑节点文字', value: '双击节点' },
  { key: '编辑节点菜单', value: '在节点右键' },
];

const HELP_MESSAGE_STYLE = {
  width: '200px',
};

export const Help = () => {
  return (
    <Popover
      zIndex={10000}
      spacing={10}
      style={{ padding: 12, overflow: 'hidden' }}
      position="bottomLeft"
      content={
        <section className={styles.sectionWrap}>
          <Descriptions data={HELP_MESSAGE} style={HELP_MESSAGE_STYLE} />
        </section>
      }
    >
      <Button size="small" theme="borderless" type="tertiary" icon={<IconHelpCircle />} />
    </Popover>
  );
};
