import { Button, Popover, Typography } from '@douyinfe/semi-ui';
import cls from 'classnames';
import { IconDrawBoard } from 'components/icons';

import { THEMES } from '../constant';
import styles from './index.module.scss';

const { Text } = Typography;

export const Theme = ({ theme, setTheme }) => {
  return (
    <Popover
      zIndex={10000}
      spacing={10}
      style={{ padding: '0 12px 12px', overflow: 'hidden' }}
      position="bottomLeft"
      content={
        <section className={styles.sectionWrap}>
          <Text type="secondary">主题</Text>
          <div>
            <ul>
              {THEMES.map((item) => {
                return (
                  <li
                    key={item.label}
                    className={cls(theme === item.value && styles.active)}
                    style={item.style || {}}
                    onClick={() => setTheme(item.value)}
                  >
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      }
    >
      <Button icon={<IconDrawBoard />} type="tertiary" theme="borderless" size="small" />
    </Popover>
  );
};
