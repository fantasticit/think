import { IconDelete } from '@douyinfe/semi-icons';
import { Popconfirm, Space, Typography } from '@douyinfe/semi-ui';
import { useDeleteDocument } from 'data/document';
import { useRouterQuery } from 'hooks/use-router-query';
import Router from 'next/router';
import React, { useCallback, useMemo } from 'react';

interface IProps {
  wikiId: string;
  documentId: string;
  onDelete?: () => void;
  render?: (arg: { children: React.ReactNode }) => React.ReactNode;
}

const { Text } = Typography;

export const DocumentDeletor: React.FC<IProps> = ({ wikiId, documentId, render, onDelete }) => {
  const {
    organizationId,
    wikiId: currentWikiId,
    documentId: currentDocumentId,
  } = useRouterQuery<{ organizationId: string; wikiId?: string; documentId?: string }>();
  const { deleteDocument: api, loading } = useDeleteDocument(documentId);

  const deleteAction = useCallback(() => {
    api().then(() => {
      const navigate = () => {
        if (wikiId !== currentWikiId || documentId !== currentDocumentId) {
          return;
        }
        Router.push({
          pathname: `/app/org/[organizationId]/wiki/[wikiId]`,
          query: { organizationId, wikiId },
        });
      };

      navigate();
      onDelete && onDelete();
    });
  }, [organizationId, wikiId, documentId, api, onDelete, currentWikiId, currentDocumentId]);

  const content = useMemo(
    () => (
      <Text type="danger">
        <Space>
          <IconDelete />
          删除
        </Space>
      </Text>
    ),
    []
  );

  return (
    <Popconfirm
      title="确定删除吗？"
      content="文档删除后不可恢复！"
      onConfirm={deleteAction}
      okButtonProps={{ loading }}
      zIndex={1070}
    >
      {render ? render({ children: content }) : content}
    </Popconfirm>
  );
};
