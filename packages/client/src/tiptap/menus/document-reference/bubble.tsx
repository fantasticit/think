import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { Space, Button, List, Popover } from '@douyinfe/semi-ui';
import { IconEdit, IconDelete } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { DataRender } from 'components/data-render';
import { useWikiTocs } from 'data/wiki';
import { BubbleMenu } from '../../views/bubble-menu';
import { DocumentReference } from '../../extensions/document-reference';
import { Divider } from '../../divider';

export const DocumentReferenceBubbleMenu = ({ editor }) => {
  const { pathname, query } = useRouter();
  const wikiIdFromUrl = query?.wikiId;
  const isShare = pathname.includes('share');
  const { data: tocs, loading, error } = useWikiTocs(isShare ? null : wikiIdFromUrl);

  const selectDoc = useCallback(
    (item) => {
      const { wikiId, title, id: documentId } = item;

      editor
        .chain()
        .updateAttributes(DocumentReference.name, { wikiId, documentId, title })
        .setNodeSelection(editor.state.selection.from)
        .focus()
        .run();
    },
    [editor]
  );

  const deleteNode = useCallback(() => editor.chain().deleteSelection().run(), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="countdonw-bubble-menu"
      shouldShow={() => editor.isActive(DocumentReference.name)}
      tippyOptions={{ maxWidth: 456 }}
    >
      <Space>
        <Popover
          spacing={10}
          content={
            <DataRender
              loading={loading}
              error={error}
              normalContent={() => (
                <List
                  style={{ maxHeight: 320, overflow: 'auto' }}
                  dataSource={tocs}
                  renderItem={(item) => (
                    <List.Item
                      onClick={() => selectDoc(item)}
                      style={{ cursor: 'pointer' }}
                      main={<span style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>{item.title}</span>}
                    />
                  )}
                />
              )}
            />
          }
          trigger="click"
        >
          <Button size="small" type="tertiary" theme="borderless" icon={<IconEdit />} />
        </Popover>

        <Divider />

        <Tooltip content="删除节点" hideOnClick>
          <Button onClick={deleteNode} icon={<IconDelete />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
