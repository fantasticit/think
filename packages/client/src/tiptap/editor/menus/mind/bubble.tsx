import { useCallback } from 'react';
import { Space, Button } from '@douyinfe/semi-ui';
import { IconCopy, IconLineHeight, IconDelete } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { BubbleMenu } from 'tiptap/editor/views/bubble-menu';
import { Mind } from 'tiptap/core/extensions/mind';
import { Divider } from 'tiptap/components/divider';
import { getEditorContainerDOMSize, copyNode, deleteNode } from 'tiptap/prose-utils';
import { useAttributes } from 'tiptap/editor/hooks/use-attributes';
import { Size } from 'tiptap/components/size';

export const MindBubbleMenu = ({ editor }) => {
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const { width, height } = useAttributes(editor, Mind.name, { width: 0, height: 0 });

  const setSize = useCallback(
    (size) => {
      editor.chain().updateAttributes(Mind.name, size).setNodeSelection(editor.state.selection.from).focus().run();
    },
    [editor]
  );

  const copyMe = useCallback(() => copyNode(Mind.name, editor), [editor]);
  const deleteMe = useCallback(() => deleteNode(Mind.name, editor), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="mind-bubble-menu"
      shouldShow={() => editor.isActive(Mind.name)}
      tippyOptions={{ maxWidth: 'calc(100vw - 100px)' }}
      matchRenderContainer={(node) => node && node.id === 'js-resizeable-container'}
    >
      <Space spacing={4}>
        <Tooltip content="复制">
          <Button onClick={copyMe} icon={<IconCopy />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Size width={width} maxWidth={maxWidth} height={height} onOk={setSize}>
          <Tooltip content="设置宽高">
            <Button icon={<IconLineHeight />} type="tertiary" theme="borderless" size="small" />
          </Tooltip>
        </Size>

        <Divider />

        <Tooltip content="删除节点" hideOnClick>
          <Button onClick={deleteMe} icon={<IconDelete />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
