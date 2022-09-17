import { IconCopy, IconDelete, IconEdit } from '@douyinfe/semi-icons';
import { Button, List, Popover, Space, Typography } from '@douyinfe/semi-ui';
import { DataRender } from 'components/data-render';
import { Divider } from 'components/divider';
import { IconDocument } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import { useUser } from 'data/user';
import { useWikiTocs } from 'data/wiki';
import { useToggle } from 'hooks/use-toggle';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { BubbleMenu } from 'tiptap/core/bubble-menu';
import { DocumentReference, IDocumentReferenceAttrs } from 'tiptap/core/extensions/document-reference';
import { useAttributes } from 'tiptap/core/hooks/use-attributes';
import { copyNode, deleteNode } from 'tiptap/prose-utils';

const { Text } = Typography;

export const DocumentReferenceBubbleMenu = ({ editor }) => {
  const attrs = useAttributes<IDocumentReferenceAttrs>(editor, DocumentReference.name, {
    defaultShowPicker: false,
    createUser: '',
  });
  const { defaultShowPicker, createUser } = attrs;
  const { user } = useUser();
  const { pathname, query } = useRouter();
  const [visible, toggleVisible] = useToggle(false);

  const wikiIdFromUrl = query?.wikiId;
  const isShare = pathname.includes('share');
  const { data: tocs, loading, error } = useWikiTocs(isShare ? null : wikiIdFromUrl);

  const shouldShow = useCallback(() => editor.isActive(DocumentReference.name), [editor]);
  const selectDoc = useCallback(
    (item) => {
      const { organizationId, wikiId, title, id: documentId } = item;

      editor
        .chain()
        .updateAttributes(DocumentReference.name, { organizationId, wikiId, documentId, title })
        .setNodeSelection(editor.state.selection.from)
        .focus()
        .run();
    },
    [editor]
  );
  const copyMe = useCallback(() => copyNode(DocumentReference.name, editor), [editor]);
  const deleteMe = useCallback(() => deleteNode(DocumentReference.name, editor), [editor]);

  const renderNormalContent = useCallback(
    () => (
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
    ),
    [selectDoc, tocs]
  );

  useEffect(() => {
    if (defaultShowPicker && user && createUser === user.id) {
      toggleVisible(true);
      editor.chain().updateAttributes(DocumentReference.name, { defaultShowPicker: false }).focus().run();
    }
  }, [editor, defaultShowPicker, toggleVisible, createUser, user]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="document-reference-bubble-menu"
      shouldShow={shouldShow}
      tippyOptions={{ maxWidth: 'calc(100vw - 100px)' }}
    >
      <Space spacing={4}>
        <Tooltip content="复制">
          <Button onClick={copyMe} icon={<IconCopy />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Popover
          spacing={15}
          visible={visible}
          onVisibleChange={toggleVisible}
          content={<DataRender loading={loading} error={error} normalContent={renderNormalContent} />}
          trigger="click"
          position="bottomLeft"
          showArrow
          style={{ padding: 0 }}
        >
          <Button size="small" type="tertiary" theme="borderless" icon={<IconEdit />} />
        </Popover>

        <Divider />

        <Tooltip content="删除节点" hideOnClick>
          <Button onClick={deleteMe} icon={<IconDelete />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
