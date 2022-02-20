import { Space, Button, Tooltip } from "@douyinfe/semi-ui";
import {
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconUpload,
  IconDelete,
} from "@douyinfe/semi-icons";
import { Upload } from "components/upload";
import { BubbleMenu } from "../components/bubble-menu";
import { Divider } from "../components/divider";
import { Image } from "../extensions/image";

export const ImageBubbleMenu = ({ editor }) => {
  return (
    <BubbleMenu
      className={"bubble-menu"}
      editor={editor}
      pluginKey="image-bubble-menu"
      shouldShow={() => editor.isActive(Image.name)}
      tippyOptions={{
        maxWidth: 456,
      }}
      matchRenderContainer={(node) =>
        node && node.id === "js-resizeable-container"
      }
    >
      <Space>
        <Tooltip content="左对齐" zIndex={10000}>
          <Button
            onClick={() => {
              editor
                .chain()
                .updateAttributes(Image.name, {
                  textAlign: "left",
                })
                .setNodeSelection(editor.state.selection.from)
                .focus()
                .run();
            }}
            icon={<IconAlignLeft />}
            type="tertiary"
            theme="borderless"
            size="small"
          />
        </Tooltip>
        <Tooltip content="居中" zIndex={10000}>
          <Button
            onClick={() => {
              editor
                .chain()
                .updateAttributes(Image.name, {
                  textAlign: "center",
                })
                .setNodeSelection(editor.state.selection.from)
                .focus()
                .run();
            }}
            icon={<IconAlignCenter />}
            type="tertiary"
            theme="borderless"
            size="small"
          />
        </Tooltip>
        <Tooltip content="右对齐" zIndex={10000}>
          <Button
            onClick={() => {
              editor
                .chain()
                .updateAttributes(Image.name, {
                  textAlign: "right",
                })
                .setNodeSelection(editor.state.selection.from)
                .focus()
                .run();
            }}
            icon={<IconAlignRight />}
            type="tertiary"
            theme="borderless"
            size="small"
          />
        </Tooltip>
        <Divider />
        <Upload
          accept="image/*"
          onOK={(url) => {
            editor
              .chain()
              .updateAttributes(Image.name, {
                src: url,
                alt: "filename",
              })
              .setNodeSelection(editor.state.selection.from)
              .focus()
              .run();
          }}
        >
          {() => (
            <Tooltip content="上传图片" zIndex={10000}>
              <Button
                size="small"
                type="tertiary"
                theme="borderless"
                icon={<IconUpload />}
              />
            </Tooltip>
          )}
        </Upload>
        <Tooltip content="删除" zIndex={10000}>
          <Button
            size="small"
            type="tertiary"
            theme="borderless"
            icon={<IconDelete />}
            onClick={() => editor.chain().deleteSelection().run()}
          />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
