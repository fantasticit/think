import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { Space, Button, List, Popover, Typography } from '@douyinfe/semi-ui';
import { IconEdit, IconDelete } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { DataRender } from 'components/data-render';
import { IconDocument } from 'components/icons';
import { useWikiTocs } from 'data/wiki';
import { BubbleMenu } from '../../views/bubble-menu';
import { Mind } from '../../extensions/mind';
import { Divider } from '../../divider';

const { Text } = Typography;

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
        <Divider />
        <Tooltip content="删除节点" hideOnClick>
          <Button onClick={deleteNode} icon={<IconDelete />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
