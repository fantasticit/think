import { Button, Popover, Typography } from '@douyinfe/semi-ui';
import cls from 'classnames';
import { IconStructure } from 'components/icons';

import { TEMPLATES } from '../constant';
import styles from './index.module.scss';

const { Text } = Typography;

export const Template = ({ template, setTemplate }) => {
  return (
    <Popover
      zIndex={10000}
      spacing={10}
      style={{ padding: '0 12px 12px', overflow: 'hidden' }}
      position="bottomLeft"
      content={
        <section className={styles.sectionWrap}>
          <Text type="secondary">布局</Text>
          <div>
            <ul>
              {TEMPLATES.map((item) => {
                return (
                  <li
                    key={item.label}
                    className={cls(template === item.value && styles.active)}
                    onClick={() => setTemplate(item.value)}
                  >
                    <Text>{item.label}</Text>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      }
    >
      <Button icon={<IconStructure />} type="tertiary" theme="borderless" size="small" />
    </Popover>
  );
};
