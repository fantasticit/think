import React, { useCallback } from "react";
import Router from "next/router";
import { Typography, Space, Modal } from "@douyinfe/semi-ui";
import { IconDelete } from "@douyinfe/semi-icons";
import { useOwnWikis } from "data/wiki";

interface IProps {
  wikiId: string;
  onDelete?: () => void;
}

const { Text } = Typography;

export const WorkspaceDeletor: React.FC<IProps> = ({
  wikiId,
  onDelete,
  children,
}) => {
  const { deletWiki } = useOwnWikis();

  const deleteAction = useCallback(() => {
    Modal.error({
      title: "确定删除吗？",
      content: <Text>删除后不可恢复！</Text>,
      onOk: () => {
        deletWiki(wikiId).then(() => {
          onDelete
            ? onDelete()
            : Router.push({
                pathname: `/wiki`,
              });
        });
      },
      okButtonProps: {
        type: "danger",
      },
      style: { maxWidth: "96vw" },
    });
  }, [wikiId, deletWiki, onDelete]);

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
