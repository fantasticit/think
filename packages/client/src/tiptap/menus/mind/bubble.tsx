import { useCallback } from 'react';
import { Space, Button } from '@douyinfe/semi-ui';
import { IconDelete } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { BubbleMenu } from '../../views/bubble-menu';
import { Mind } from '../../extensions/mind';

export const MindBubbleMenu = ({ editor }) => {
  const deleteNode = useCallback(() => editor.chain().deleteSelection().run(), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="mind-bubble-menu"
      shouldShow={() => editor.isActive(Mind.name)}
      tippyOptions={{ maxWidth: 'calc(100vw - 100px)' }}
    >
      <Space>
        <Tooltip content="删除节点" hideOnClick>
          <Button onClick={deleteNode} icon={<IconDelete />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
