import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconCopy,
  IconDelete,
  IconLineHeight,
} from '@douyinfe/semi-icons';
import { Button, Space } from '@douyinfe/semi-ui';
import { Divider } from 'components/divider';
import { SizeSetter } from 'components/size-setter';
import { Tooltip } from 'components/tooltip';
import React, { useCallback, useEffect, useState } from 'react';
import { BubbleMenu } from 'tiptap/core/bubble-menu';
import { Image } from 'tiptap/core/extensions/image';
import { useAttributes } from 'tiptap/core/hooks/use-attributes';
import { copyNode, deleteNode, getEditorContainerDOMSize } from 'tiptap/prose-utils';

export const ImageBubbleMenu = ({ editor }) => {
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const { width: currentWidth, height: currentHeight } = useAttributes(editor, Image.name, { width: 0, height: 0 });
  const [width, setWidth] = useState(currentWidth);
  const [height, setHeight] = useState(currentHeight);

  const shouldShow = useCallback(() => editor.isActive(Image.name) && !!editor.getAttributes(Image.name).src, [editor]);
  const getRenderContainer = useCallback((node) => {
    try {
      const inner = node.querySelector('#js-resizeable-container');
      return inner as HTMLElement;
    } catch (e) {
      return node;
    }
  }, []);
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
      shouldShow={shouldShow}
      tippyOptions={{
        maxWidth: 'calc(100vw - 100px)',
      }}
      getRenderContainer={getRenderContainer}
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

        <SizeSetter width={width} maxWidth={maxWidth} height={height} onOk={updateSize}>
          <Tooltip content="设置宽高">
            <Button icon={<IconLineHeight />} type="tertiary" theme="borderless" size="small" />
          </Tooltip>
        </SizeSetter>

        <Divider />

        <Tooltip content="删除" hideOnClick>
          <Button size="small" type="tertiary" theme="borderless" icon={<IconDelete />} onClick={deleteMe} />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
