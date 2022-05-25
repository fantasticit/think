import { IconChevronLeft, IconChevronRight } from '@douyinfe/semi-icons';
import { Button, Layout as SemiLayout } from '@douyinfe/semi-ui';
import cls from 'classnames';
import { useDragableWidth } from 'hooks/use-dragable-width';
import React from 'react';
import SplitPane from 'react-split-pane';

import styles from './index.module.scss';

const { Sider, Content } = SemiLayout;

interface IProps {
  leftNode: React.ReactNode;
  rightNode: React.ReactNode;
}

export const PublicDoubleColumnLayout: React.FC<IProps> = ({ leftNode, rightNode }) => {
  const { minWidth, maxWidth, width, isCollapsed, updateWidth, toggleCollapsed } = useDragableWidth();

  return (
    <SemiLayout className={styles.wrap}>
      <SplitPane minSize={minWidth} maxSize={maxWidth} size={width} onChange={updateWidth}>
        <Sider style={{ width: '100%', height: '100%' }} className={styles.leftWrap}>
          <Button
            size="small"
            icon={isCollapsed ? <IconChevronRight /> : <IconChevronLeft />}
            className={cls(styles.collapseBtn)}
            onClick={toggleCollapsed}
          />
          <div
            style={{
              opacity: isCollapsed ? 0 : 1,
            }}
            className={styles.leftContentWrap}
          >
            {leftNode}
          </div>
        </Sider>
        <Content className={styles.rightWrap}>{rightNode}</Content>
      </SplitPane>
    </SemiLayout>
  );
};
