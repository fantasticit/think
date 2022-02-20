import React from "react";
import { Space, Button, Tooltip } from "@douyinfe/semi-ui";
import { IconUndo, IconRedo } from "@douyinfe/semi-icons";
import { IconClear } from "components/icons";
import { Divider } from "./components/divider";
import { MediaInsertMenu } from "./menus/media-insert";
import { Paragraph } from "./menus/components/paragraph";
import { FontSize } from "./menus/components/font-size";
import { BaseMenu } from "./menus/base-menu";
import { AlignMenu } from "./menus/align";
import { ListMenu } from "./menus/list";
import { BaseInsertMenu } from "./menus/base-insert";
import { BaseBubbleMenu } from "./menus/base-bubble-menu";
import { ImageBubbleMenu } from "./menus/image";
import { BannerBubbleMenu } from "./menus/banner";
import { LinkBubbleMenu } from "./menus/link";
import { TableBubbleMenu } from "./menus/table";

export const MenuBar: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <Space spacing={2}>
        <MediaInsertMenu editor={editor} />

        <Divider />
        <Tooltip content="撤销">
          <Button
            onClick={() => editor.chain().focus().undo().run()}
            icon={<IconUndo />}
            type="tertiary"
            theme="borderless"
          />
        </Tooltip>

        <Tooltip content="重做">
          <Button
            onClick={() => editor.chain().focus().redo().run()}
            icon={<IconRedo />}
            type="tertiary"
            theme="borderless"
          />
        </Tooltip>

        <Tooltip content="清除格式">
          <Button
            onClick={() => {
              editor.chain().focus().unsetAllMarks().run();
              editor.chain().focus().clearNodes().run();
            }}
            icon={<IconClear />}
            type="tertiary"
            theme="borderless"
          />
        </Tooltip>

        <Divider />
        <Paragraph editor={editor} />
        <FontSize editor={editor} />
        <BaseMenu editor={editor} />

        <Divider />
        <AlignMenu editor={editor} />

        <Divider />
        <ListMenu editor={editor} />

        <Divider />
        <BaseInsertMenu editor={editor} />
      </Space>

      <BaseBubbleMenu editor={editor} />
      <ImageBubbleMenu editor={editor} />
      <LinkBubbleMenu editor={editor} />
      <BannerBubbleMenu editor={editor} />
      <TableBubbleMenu editor={editor} />
    </>
  );
};

export const CommentMenuBar: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <Space spacing={2}>
        <Tooltip content="撤销">
          <Button
            onClick={() => editor.chain().focus().undo().run()}
            icon={<IconUndo />}
            type="tertiary"
            theme="borderless"
          />
        </Tooltip>

        <Tooltip content="重做">
          <Button
            onClick={() => editor.chain().focus().redo().run()}
            icon={<IconRedo />}
            type="tertiary"
            theme="borderless"
          />
        </Tooltip>

        <Tooltip content="清除格式">
          <Button
            onClick={() => {
              editor.chain().focus().unsetAllMarks().run();
              editor.chain().focus().clearNodes().run();
            }}
            icon={<IconClear />}
            type="tertiary"
            theme="borderless"
          />
        </Tooltip>

        <Divider />
        <BaseMenu editor={editor} />

        <Divider />
        <AlignMenu editor={editor} />

        <Divider />
        <BaseInsertMenu editor={editor} />
      </Space>

      <BaseBubbleMenu editor={editor} />
      <ImageBubbleMenu editor={editor} />
      <LinkBubbleMenu editor={editor} />
      <BannerBubbleMenu editor={editor} />
      <TableBubbleMenu editor={editor} />
    </>
  );
};
