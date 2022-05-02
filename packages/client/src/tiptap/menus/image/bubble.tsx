import React, { useCallback, useEffect, useState } from 'react';
import { Space, Button } from '@douyinfe/semi-ui';
import {
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconLineHeight,
  IconCopy,
  IconDelete,
} from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { BubbleMenu } from 'tiptap/views/bubble-menu';
import { Divider } from 'tiptap/divider';
import { Image } from 'tiptap/extensions/image';
import { getEditorContainerDOMSize, copyNode, deleteNode } from 'tiptap/prose-utils';
import { useAttributes } from 'tiptap/hooks/use-attributes';
import { Size } from '../_components/size';

export const ImageBubbleMenu = ({ editor }) => {
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const { width: currentWidth, height: currentHeight } = useAttributes(editor, Image.name, { width: 0, height: 0 });
  const [width, setWidth] = useState(currentWidth);
  const [height, setHeight] = useState(currentHeight);

  const copyMe = useCallback(() => copyNode(Image.name, editor), [editor]);
  const deleteMe = useCallback(() => deleteNode(Image.name, editor), [editor]);

  const alignLeft = useCallback(() => {
    editor
      .chain()
      .updateAttributes(Image.name, {
        textAlign: 'left',
      })
      .setNodeSelection(editor.state.selection.from)
      .focus()
      .run();
  }, [editor]);

  const alignCenter = useCallback(() => {
    editor
      .chain()
      .updateAttributes(Image.name, {
        textAlign: 'center',
      })
      .setNodeSelection(editor.state.selection.from)
      .focus()
      .run();
  }, [editor]);

  const alignRight = useCallback(() => {
    editor
      .chain()
      .updateAttributes(Image.name, {
        textAlign: 'right',
      })
      .setNodeSelection(editor.state.selection.from)
      .focus()
      .run();
  }, [editor]);

  const updateSize = useCallback(
    (size) => {
      editor.chain().updateAttributes(Image.name, size).setNodeSelection(editor.state.selection.from).focus().run();
    },
    [editor]
  );

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
        maxWidth: 'calc(100vw - 100px)',
      }}
      matchRenderContainer={(node) => node && node.id === 'js-resizeable-container'}
    >
      <Space spacing={4}>
        <Tooltip content="复制">
          <Button onClick={copyMe} icon={<IconCopy />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Tooltip content="左对齐">
          <Button onClick={alignLeft} icon={<IconAlignLeft />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Tooltip content="居中">
          <Button onClick={alignCenter} icon={<IconAlignCenter />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Tooltip content="右对齐">
          <Button onClick={alignRight} icon={<IconAlignRight />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Size width={width} maxWidth={maxWidth} height={height} onOk={updateSize}>
          <Tooltip content="设置宽高">
            <Button icon={<IconLineHeight />} type="tertiary" theme="borderless" size="small" />
          </Tooltip>
        </Size>

        <Divider />

        <Tooltip content="删除" hideOnClick>
          <Button size="small" type="tertiary" theme="borderless" icon={<IconDelete />} onClick={deleteMe} />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
