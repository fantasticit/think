import React, { useCallback } from 'react';
import Router from 'next/router';
import { Typography, Space, Modal } from '@douyinfe/semi-ui';
import { IconDelete } from '@douyinfe/semi-icons';
import { useDeleteDocument } from 'data/document';
import { triggerRefreshTocs } from 'event';

interface IProps {
  wikiId: string;
  documentId: string;
  onDelete?: () => void;
}

const { Text } = Typography;

export const DocumentDeletor: React.FC<IProps> = ({ wikiId, documentId, onDelete }) => {
  const { deleteDocument: api, loading } = useDeleteDocument(documentId);

  const deleteAction = useCallback(() => {
    Modal.error({
      title: '确定删除吗？',
      content: <Text>文档删除后不可恢复！</Text>,
      onOk: () => {
        api().then(() => {
          onDelete
            ? onDelete()
            : Router.push({
                pathname: `/wiki/${wikiId}`,
              });
          triggerRefreshTocs();
        });
      },
      okButtonProps: { loading, type: 'danger' },
      style: { maxWidth: '96vw' },
    });
  }, [wikiId, api, loading, onDelete]);

  return (
    <Text type="danger" onClick={deleteAction}>
      <Space>
        <IconDelete />
        删除
      </Space>
    </Text>
  );
};
