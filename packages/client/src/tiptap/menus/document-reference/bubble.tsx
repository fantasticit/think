import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { Space, Button, List, Popover, Typography } from '@douyinfe/semi-ui';
import { IconEdit, IconDelete } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { DataRender } from 'components/data-render';
import { IconDocument } from 'components/icons';
import { useWikiTocs } from 'data/wiki';
import { BubbleMenu } from 'tiptap/views/bubble-menu';
import { DocumentReference } from 'tiptap/extensions/document-reference';
import { Divider } from 'tiptap/divider';

const { Text } = Typography;

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
      pluginKey="document-reference-bubble-menu"
      shouldShow={() => editor.isActive(DocumentReference.name)}
      tippyOptions={{ maxWidth: 'calc(100vw - 100px)' }}
    >
      <Space>
        <Popover
          spacing={15}
          content={
            <DataRender
              loading={loading}
              error={error}
              normalContent={() => (
                <List
                  size="small"
                  style={{ maxHeight: 320, overflow: 'auto' }}
                  dataSource={tocs}
                  renderItem={(item) => (
                    <List.Item
                      onClick={() => selectDoc(item)}
                      style={{ cursor: 'pointer' }}
                      main={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Text style={{ display: 'flex', alignItems: 'center' }}>
                            <IconDocument />
                          </Text>
                          <Text
                            ellipsis={{ showTooltip: { opts: { content: item.title, position: 'right' } } }}
                            style={{ width: 150, paddingLeft: 6 }}
                          >
                            {item.title}
                          </Text>
                        </div>
                      }
                    />
                  )}
                />
              )}
            />
          }
          trigger="click"
          position="bottomLeft"
          showArrow
          style={{ padding: 0 }}
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
