import { IconDelete } from '@douyinfe/semi-icons';
import { Modal, Space, Typography } from '@douyinfe/semi-ui';
import { useDeleteDocument } from 'data/document';
import { useRouterQuery } from 'hooks/use-router-query';
import Router from 'next/router';
import React, { useCallback } from 'react';

interface IProps {
  wikiId: string;
  documentId: string;
  onDelete?: () => void;
}

const { Text } = Typography;

export const DocumentDeletor: React.FC<IProps> = ({ wikiId, documentId, onDelete }) => {
  const { wikiId: currentWikiId, documentId: currentDocumentId } =
    useRouterQuery<{ wikiId?: string; documentId?: string }>();
  const { deleteDocument: api, loading } = useDeleteDocument(documentId);

  const deleteAction = useCallback(() => {
    Modal.error({
      title: '确定删除吗？',
      content: <Text>文档删除后不可恢复！</Text>,
      onOk: () => {
        api().then(() => {
          const navigate = () => {
            if (wikiId !== currentWikiId || documentId !== currentDocumentId) {
              return;
            }
            Router.push({
              pathname: `/wiki/${wikiId}`,
            });
          };

          onDelete ? onDelete() : navigate();
        });
      },
      okButtonProps: { loading, type: 'danger' },
      style: { maxWidth: '96vw' },
    });
  }, [wikiId, documentId, api, loading, onDelete, currentWikiId, currentDocumentId]);

  return (
    <Text type="danger" onClick={deleteAction}>
      <Space>
        <IconDelete />
        删除
      </Space>
    </Text>
  );
};
