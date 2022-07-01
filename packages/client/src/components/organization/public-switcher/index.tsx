import { Space } from '@douyinfe/semi-ui';
import { LogoImage, LogoText } from 'components/logo';
import { useUser } from 'data/user';
import { useWindowSize } from 'hooks/use-window-size';

import { UserOrganizationsSwitcher } from '../switcher';
import styles from './index.module.scss';

export const OrganizationPublicSwitcher = () => {
  const { user } = useUser();
  const { width } = useWindowSize();

  return (
    <span className={styles.nameWrap}>
      <Space>
        <LogoImage />
        {width >= 768 && <LogoText />}
      </Space>
      {user && <UserOrganizationsSwitcher />}
    </span>
  );
};
