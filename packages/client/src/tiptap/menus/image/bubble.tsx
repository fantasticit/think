import React, { useEffect, useState } from 'react';
import { Space, Button } from '@douyinfe/semi-ui';
import { IconAlignLeft, IconAlignCenter, IconAlignRight, IconLineHeight, IconDelete } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { BubbleMenu } from '../../views/bubble-menu';
import { Divider } from '../../divider';
import { Image } from '../../extensions/image';
import { Size } from '../_components/size';

export const ImageBubbleMenu = ({ editor }) => {
  const attrs = editor.getAttributes(Image.name);
  const { width: currentWidth, height: currentHeight } = attrs;
  const [width, setWidth] = useState(currentWidth);
  const [height, setHeight] = useState(currentHeight);

  useEffect(() => {
    setWidth(parseInt(currentWidth));
    setHeight(parseInt(currentHeight));
  }, [currentWidth, currentHeight]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="image-bubble-menu"
      shouldShow={() => editor.isActive(Image.name) && !!editor.getAttributes(Image.name).src}
      tippyOptions={{
        maxWidth: 456,
      }}
      matchRenderContainer={(node) => node && node.id === 'js-resizeable-container'}
    >
      <Space>
        <Tooltip content="左对齐">
          <Button
            onClick={() => {
              editor
                .chain()
                .updateAttributes(Image.name, {
                  textAlign: 'left',
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

        <Tooltip content="居中">
          <Button
            onClick={() => {
              editor
                .chain()
                .updateAttributes(Image.name, {
                  textAlign: 'center',
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

        <Tooltip content="右对齐">
          <Button
            onClick={() => {
              editor
                .chain()
                .updateAttributes(Image.name, {
                  textAlign: 'right',
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

        <Size
          width={width}
          height={height}
          onOk={(size) => {
            editor
              .chain()
              .updateAttributes(Image.name, size)
              .setNodeSelection(editor.state.selection.from)
              .focus()
              .run();
          }}
        >
          <Tooltip content="设置宽高">
            <Button icon={<IconLineHeight />} type="tertiary" theme="borderless" size="small" />
          </Tooltip>
        </Size>

        <Divider />

        <Tooltip content="删除" hideOnClick>
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
