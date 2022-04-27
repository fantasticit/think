import { useCallback } from 'react';
import { Space, Button } from '@douyinfe/semi-ui';
import { IconLineHeight, IconDelete } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { BubbleMenu } from '../../views/bubble-menu';
import { Mind } from '../../extensions/mind';
import { Size } from '../_components/size';
import { Divider } from '../../divider';
import { getEditorContainerDOMSize } from '../../utils/editor';

export const MindBubbleMenu = ({ editor }) => {
  const attrs = editor.getAttributes(Mind.name);
  const { width, height } = attrs;
  const { width: maxWidth } = getEditorContainerDOMSize(editor);

  const setSize = useCallback(
    (size) => {
      editor.chain().updateAttributes(Mind.name, size).setNodeSelection(editor.state.selection.from).focus().run();
    },
    [editor]
  );

  const deleteNode = useCallback(() => editor.chain().deleteSelection().run(), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="mind-bubble-menu"
      shouldShow={() => editor.isActive(Mind.name)}
      tippyOptions={{ maxWidth: 'calc(100vw - 100px)' }}
      matchRenderContainer={(node) => node && node.id === 'js-resizeable-container'}
    >
      <Space>
        <Size width={width} maxWidth={maxWidth} height={height} onOk={setSize}>
          <Tooltip content="设置宽高">
            <Button icon={<IconLineHeight />} type="tertiary" theme="borderless" size="small" />
          </Tooltip>
        </Size>
        <Divider />
        <Tooltip content="删除节点" hideOnClick>
          <Button onClick={deleteNode} icon={<IconDelete />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
