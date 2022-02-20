import React from "react";
import { Layout as SemiLayout } from "@douyinfe/semi-ui";
import { RouterHeader } from "../router-header";
import styles from "./index.module.scss";

const { Content } = SemiLayout;

export const SingleColumnLayout: React.FC = ({ children }) => {
  return (
    <SemiLayout className={styles.wrap}>
      <RouterHeader />
      <SemiLayout className={styles.contentWrap}>
        <Content
          style={{
            padding: "16px 24px",
            backgroundColor: "var(--semi-color-bg-0)",
          }}
        >
          <div>{children}</div>
        </Content>
      </SemiLayout>
    </SemiLayout>
  );
};
