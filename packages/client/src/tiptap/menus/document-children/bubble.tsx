import { useCallback } from 'react';
import { Space, Button } from '@douyinfe/semi-ui';
import { IconDelete } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { BubbleMenu } from 'tiptap/views/bubble-menu';
import { DocumentChildren } from 'tiptap/extensions/document-children';

export const DocumentChildrenBubbleMenu = ({ editor }) => {
  const deleteNode = useCallback(() => editor.chain().deleteSelection().run(), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="document-children-bubble-menu"
      shouldShow={() => editor.isActive(DocumentChildren.name)}
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
