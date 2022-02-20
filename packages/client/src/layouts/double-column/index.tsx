import React from "react";
import cls from "classnames";
import { Layout as SemiLayout, Button } from "@douyinfe/semi-ui";
import { IconChevronLeft, IconChevronRight } from "@douyinfe/semi-icons";
import SplitPane from "react-split-pane";
import { useDragableWidth, MIN_WIDTH, MAX_WIDTH } from "hooks/useDragableWidth";
import { RouterHeader } from "../router-header";
import styles from "./index.module.scss";

const { Sider, Content } = SemiLayout;

interface IProps {
  leftNode: React.ReactNode;
  rightNode: React.ReactNode;
}

export const DoubleColumnLayout: React.FC<IProps> = ({
  leftNode,
  rightNode,
}) => {
  const { width, isCollapsed, updateWidth, toggleCollapsed } =
    useDragableWidth();

  return (
    <SemiLayout className={styles.wrap}>
      <RouterHeader />
      <SemiLayout className={styles.contentWrap}>
        <SplitPane
          minSize={MIN_WIDTH}
          maxSize={MAX_WIDTH}
          size={width}
          onChange={updateWidth}
        >
          <Sider
            style={{ width: "100%", height: "100%" }}
            className={styles.leftWrap}
          >
            <Button
              size="small"
              icon={isCollapsed ? <IconChevronRight /> : <IconChevronLeft />}
              className={cls(
                styles.collapseBtn,
                isCollapsed && styles.isCollapsed
              )}
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
    </SemiLayout>
  );
};
