import { IconDelete } from '@douyinfe/semi-icons';
import { Modal, Space, Typography } from '@douyinfe/semi-ui';
import { IOrganization } from '@think/domains';
import { useOrganizationDetail } from 'data/organization';
import { useRouterQuery } from 'hooks/use-router-query';
import Router from 'next/router';
import React, { useCallback } from 'react';

interface IProps {
  organizationId: IOrganization['id'];
  onDelete?: () => void;
}

const { Text } = Typography;

export const OrganizationDeletor: React.FC<IProps> = ({ organizationId, onDelete, children }) => {
  const { deleteOrganization } = useOrganizationDetail(organizationId);

  const deleteAction = useCallback(() => {
    Modal.error({
      title: '确定删除吗？',
      content: <Text>删除后不可恢复！</Text>,
      onOk: () => {
        deleteOrganization().then(() => {
          onDelete
            ? onDelete()
            : Router.push({
                pathname: `/`,
              });
        });
      },
      okButtonProps: {
        type: 'danger',
      },
      style: { maxWidth: '96vw' },
    });
  }, [deleteOrganization, onDelete]);

  return (
    <Text type="danger" onClick={deleteAction}>
      {children || (
        <Space>
          <IconDelete />
          删除
        </Space>
      )}
    </Text>
  );
};
