import React from "react";
import { Button, Tooltip, Dropdown, Popover } from "@douyinfe/semi-ui";
import { IconPlus } from "@douyinfe/semi-icons";
import { Upload } from "components/upload";
import {
  IconDocument,
  IconMind,
  IconTable,
  IconImage,
  IconCodeBlock,
  IconLink,
  IconStatus,
  IconInfo,
  IconAttachment,
  IconMath,
} from "components/icons";
import { GridSelect } from "components/grid-select";
import { isTitleActive } from "../utils/active";

export const MediaInsertMenu: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Dropdown
      zIndex={10000}
      trigger="click"
      position="bottomLeft"
      render={
        <Dropdown.Menu>
          <Dropdown.Title>通用</Dropdown.Title>

          {/* <Dropdown.Item onClick={() => editor.chain().focus().setToc().run()}>
            <IconCodeBlock /> 目录
          </Dropdown.Item> */}

          <Popover
            showArrow
            position="rightTop"
            zIndex={10000}
            content={
              <div style={{ padding: 0 }}>
                <GridSelect
                  onSelect={({ rows, cols }) => {
                    return editor
                      .chain()
                      .focus()
                      .insertTable({ rows, cols, withHeaderRow: true })
                      .run();
                  }}
                />
              </div>
            }
          >
            <Dropdown.Item
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <IconTable /> 表格
            </Dropdown.Item>
          </Popover>

          <Dropdown.Item
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <IconCodeBlock /> 代码块
          </Dropdown.Item>
          <Dropdown.Item>
            <IconImage />
            <Upload
              accept="image/*"
              onOK={(url) =>
                editor.chain().focus().setImage({ src: url }).run()
              }
            >
              {() => "图片"}
            </Upload>
          </Dropdown.Item>
          <Dropdown.Item>
            <IconAttachment />
            <Upload
              onOK={(url, name) => {
                editor.chain().focus().setAttachment({ url, name }).run();
              }}
            >
              {() => "附件"}
            </Upload>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() =>
              editor.chain().focus().insertIframe({ url: "" }).run()
            }
          >
            <IconLink /> 外链
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => editor.chain().focus().insertMind().run()}
          >
            <IconMind /> 思维导图
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => editor.chain().focus().setKatex().run()}
          >
            <IconMath /> 数学公式
          </Dropdown.Item>

          <Dropdown.Divider />
          <Dropdown.Title>卡片</Dropdown.Title>
          <Dropdown.Item
            onClick={() => editor.chain().focus().setStatus().run()}
          >
            <IconStatus /> 状态
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() =>
              editor.chain().focus().setBanner({ type: "info" }).run()
            }
          >
            <IconInfo /> 信息框
          </Dropdown.Item>

          <Dropdown.Divider />
          <Dropdown.Title>文档</Dropdown.Title>
          <Dropdown.Item
            onClick={() => editor.chain().focus().setDocumentReference().run()}
          >
            <IconDocument /> 文档
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => editor.chain().focus().setDocumentChildren().run()}
          >
            <IconDocument /> 子文档
          </Dropdown.Item>
        </Dropdown.Menu>
      }
    >
      <div>
        <Tooltip content="插入" zIndex={10000}>
          <Button
            type="tertiary"
            theme="borderless"
            icon={<IconPlus />}
            disabled={isTitleActive(editor)}
          />
        </Tooltip>
      </div>
    </Dropdown>
  );
};
