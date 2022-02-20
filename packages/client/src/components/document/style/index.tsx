import React from "react";
import { RadioGroup, Radio, Typography, Slider } from "@douyinfe/semi-ui";
import { useDocumentStyle } from "hooks/useDocumentStyle";
import styles from "./index.module.scss";

const { Text } = Typography;

export const DocumentStyle = () => {
  const { width, fontSize, setWidth, setFontSize } = useDocumentStyle();

  return (
    <div className={styles.wrap}>
      <div className={styles.item}>
        <Text>正文大小</Text>
        <Text style={{ fontSize: "0.8em" }}> {fontSize}px</Text>
        <Slider
          min={12}
          max={24}
          step={1}
          tooltipVisible={false}
          value={fontSize}
          onChange={setFontSize}
        />
      </div>
      <div className={styles.item}>
        <Text>页面尺寸</Text>
        <div>
          <RadioGroup
            type="button"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            style={{ marginTop: "0.5em" }}
          >
            <Radio value={"standardWidth"}>标宽模式</Radio>
            <Radio value={"fullWidth"}>超宽模式</Radio>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};
