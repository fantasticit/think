import { IconCopy, IconDelete, IconEdit, IconLineHeight } from '@douyinfe/semi-icons';
import { Button, Space } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import { useCallback } from 'react';
import { Divider } from 'tiptap/components/divider';
import { Size } from 'tiptap/components/size';
import { Mind } from 'tiptap/core/extensions/mind';
import { useAttributes } from 'tiptap/editor/hooks/use-attributes';
import { BubbleMenu } from 'tiptap/editor/views/bubble-menu';
import { copyNode, deleteNode, getEditorContainerDOMSize } from 'tiptap/prose-utils';

import { triggerOpenMindSettingModal } from '../_event';

export const MindBubbleMenu = ({ editor }) => {
  const attrs = useAttributes(editor, Mind.name, {});
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const { width, height } = useAttributes(editor, Mind.name, { width: 0, height: 0 });

  const setSize = useCallback(
    (size) => {
      editor.chain().updateAttributes(Mind.name, size).setNodeSelection(editor.state.selection.from).focus().run();
    },
    [editor]
  );
  const shouldShow = useCallback(() => editor.isActive(Mind.name), [editor]);
  const getRenderContainer = useCallback((node) => {
    try {
      const inner = node.querySelector('#js-resizeable-container');
      return inner as HTMLElement;
    } catch (e) {
      return node;
    }
  }, []);
  const copyMe = useCallback(() => copyNode(Mind.name, editor), [editor]);
  const deleteMe = useCallback(() => deleteNode(Mind.name, editor), [editor]);
  const openEditLinkModal = useCallback(() => {
    triggerOpenMindSettingModal(editor, attrs);
  }, [editor, attrs]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="mind-bubble-menu"
      tippyOptions={{ maxWidth: 'calc(100vw - 100px)' }}
      shouldShow={shouldShow}
      getRenderContainer={getRenderContainer}
    >
      <Space spacing={4}>
        <Tooltip content="复制">
          <Button onClick={copyMe} icon={<IconCopy />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Tooltip content="编辑">
          <Button size="small" type="tertiary" theme="borderless" icon={<IconEdit />} onClick={openEditLinkModal} />
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
