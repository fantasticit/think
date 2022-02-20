import React from "react";
import { Dropdown } from "@douyinfe/semi-ui";
import styles from "./style.module.scss";

const colors = [
  "rgb(23, 43, 77)",
  "rgb(7, 71, 166)",
  "rgb(0, 141, 166)",
  "rgb(0, 102, 68)",
  "rgb(255, 153, 31)",
  "rgb(191, 38, 0)",
  "rgb(64, 50, 148)",
  "rgb(151, 160, 175)",
  "rgb(76, 154, 255)",
  "rgb(0, 184, 217)",
  "rgb(54, 179, 126)",
  "rgb(255, 196, 0)",
  "rgb(255, 86, 48)",
  "rgb(101, 84, 192)",
  "rgb(255, 255, 255)",
  "rgb(179, 212, 255)",
  "rgb(179, 245, 255)",
  "rgb(171, 245, 209)",
  "rgb(255, 240, 179)",
  "rgb(255, 189, 173)",
  "rgb(234, 230, 255)",
];

export const Color: React.FC<{
  onSetColor;
  disabled?: boolean;
}> = ({ children, onSetColor, disabled = false }) => {
  if (disabled)
    return <span style={{ display: "inline-block" }}>{children}</span>;

  return (
    <Dropdown
      zIndex={10000}
      trigger="click"
      position={"bottom"}
      render={
        <div className={styles.colorWrap}>
          {colors.map((color) => {
            return (
              <div
                key={color}
                className={styles.colorItem}
                onClick={() => onSetColor(color)}
              >
                <span style={{ backgroundColor: color }}></span>
              </div>
            );
          })}
        </div>
      }
    >
      <span style={{ display: "inline-block" }}>{children}</span>
    </Dropdown>
  );
};
