import React from "react";
import { Button, Tooltip } from "@douyinfe/semi-ui";
import { IconFont, IconMark } from "@douyinfe/semi-icons";
import { isTitleActive } from "../utils/active";
import { Color } from "../components/color";

export const ColorMenu: React.FC<{ editor: any }> = ({ editor }) => {
  const { color, backgroundColor } = editor.getAttributes("textStyle");

  if (!editor) {
    return null;
  }

  return (
    <>
      <Color
        onSetColor={(color) => {
          editor.chain().focus().setColor(color).run();
        }}
        disabled={isTitleActive(editor)}
      >
        <Tooltip zIndex={10000} content="文本色">
          <Button
            theme={editor.isActive("textStyle") ? "light" : "borderless"}
            type={"tertiary"}
            icon={
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <IconFont style={{ fontSize: "0.85em" }} />
                <span
                  style={{
                    width: 12,
                    height: 2,
                    backgroundColor: color,
                  }}
                ></span>
              </div>
            }
            disabled={isTitleActive(editor)}
          />
        </Tooltip>
      </Color>
      <Color
        onSetColor={(color) => {
          editor.chain().focus().setBackgroundColor(color).run();
        }}
        disabled={isTitleActive(editor)}
      >
        <Tooltip zIndex={10000} content="背景色">
          <Button
            theme={editor.isActive("textStyle") ? "light" : "borderless"}
            type={"tertiary"}
            icon={
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <IconMark />
                <span style={{ backgroundColor, width: 12, height: 2 }}></span>
              </div>
            }
            disabled={isTitleActive(editor)}
          />
        </Tooltip>
      </Color>
    </>
  );
};
