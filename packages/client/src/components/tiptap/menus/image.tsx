import React, { useEffect, useState } from 'react';
import { Space, Button, Tooltip, InputNumber, Typography } from '@douyinfe/semi-ui';
import {
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconUpload,
  IconDelete,
} from '@douyinfe/semi-icons';
import { Upload } from 'components/upload';
import { BubbleMenu } from './components/bubble-menu';
import { Divider } from '../components/divider';
import { Image } from '../extensions/image';
import { getImageOriginSize } from '../services/image';

const { Text } = Typography;

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
      shouldShow={() => editor.isActive(Image.name)}
      tippyOptions={{
        maxWidth: 456,
      }}
      matchRenderContainer={(node) => node && node.id === 'js-resizeable-container'}
    >
      <Space>
        <Tooltip content="左对齐" zIndex={10000}>
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
        <Tooltip content="居中" zIndex={10000}>
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
        <Tooltip content="右对齐" zIndex={10000}>
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
        <Text>宽</Text>
        <InputNumber
          size="small"
          hideButtons
          value={width}
          style={{ width: 60 }}
          onEnterPress={(e) => {
            const value = (e.target as HTMLInputElement).value;
            editor
              .chain()
              .updateAttributes(Image.name, {
                width: value,
              })
              .setNodeSelection(editor.state.selection.from)
              .focus()
              .run();
          }}
        />
        <Text>高</Text>
        <InputNumber
          size="small"
          hideButtons
          value={height}
          style={{ width: 60 }}
          onEnterPress={(e) => {
            const value = (e.target as HTMLInputElement).value;
            editor
              .chain()
              .updateAttributes(Image.name, {
                height: value,
              })
              .setNodeSelection(editor.state.selection.from)
              .focus()
              .run();
          }}
        />
        <Divider />
        <Upload
          accept="image/*"
          onOK={async (url, fileName) => {
            const { width, height } = await getImageOriginSize(url);
            editor
              .chain()
              .updateAttributes(Image.name, {
                src: url,
                alt: fileName,
                width,
                height,
              })
              .setNodeSelection(editor.state.selection.from)
              .focus()
              .run();
          }}
        >
          {() => (
            <Tooltip content="上传图片" zIndex={10000}>
              <Button size="small" type="tertiary" theme="borderless" icon={<IconUpload />} />
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
