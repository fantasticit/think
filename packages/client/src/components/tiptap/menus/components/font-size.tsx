import React, { useCallback } from "react";
import { Select } from "@douyinfe/semi-ui";
import { isTitleActive } from "../../utils/active";

export const FONT_SIZES = [12, 13, 14, 15, 16, 19, 22, 24, 29, 32, 40, 48];

export const FontSize = ({ editor }) => {
  const currentFontSizePx =
    editor.getAttributes("textStyle").fontSize || "16px";
  const currentFontSize = +currentFontSizePx.replace("px", "");

  const toggle = useCallback((val) => {
    editor
      .chain()
      .focus()
      .setFontSize(val + "px")
      .run();
  }, []);

  return (
    <Select
      disabled={isTitleActive(editor)}
      value={currentFontSize}
      onChange={toggle}
      style={{ width: 80, marginRight: 10 }}
    >
      {FONT_SIZES.map((fontSize) => (
        <Select.Option key={fontSize} value={fontSize}>
          {fontSize}px
        </Select.Option>
      ))}
    </Select>
  );
};
