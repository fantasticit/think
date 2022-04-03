import React from 'react';
import { Space, Button } from '@douyinfe/semi-ui';
import { IconUndo, IconRedo } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { IconClear } from 'components/icons';
import { Divider } from './divider';
import { MediaInsertMenu } from './menus/media-insert';
import { Paragraph } from './menus/paragraph';
import { FontSize } from './menus/font-size';
import { BaseMenu } from './menus/base-menu';
import { AlignMenu } from './menus/align';
import { ListMenu } from './menus/list';
import { BaseInsertMenu } from './menus/base-insert';
import { BaseBubbleMenu } from './menus/base-bubble-menu';
import { ImageBubbleMenu } from './menus/image';
import { BannerBubbleMenu } from './menus/banner';
import { LinkBubbleMenu } from './menus/link';
import { IframeBubbleMenu } from './menus/iframe';
import { TableBubbleMenu } from './menus/table';

import { CountdownBubbleMenu } from './menus/countdown';
import { CountdownSettingModal } from './menus/countdown-setting';

export const MenuBar: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div>
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
      <IframeBubbleMenu editor={editor} />
      <BannerBubbleMenu editor={editor} />
      <TableBubbleMenu editor={editor} />

      <CountdownBubbleMenu editor={editor} />
      <CountdownSettingModal editor={editor} />
    </div>
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
      </Space>
    </>
  );
};
