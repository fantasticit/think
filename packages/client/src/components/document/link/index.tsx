import React, { useCallback } from "react";
import { Typography, Space } from "@douyinfe/semi-ui";
import { IconLink } from "@douyinfe/semi-icons";
import { copy } from "helpers/copy";
import { buildUrl } from "helpers/url";

interface IProps {
  wikiId: string;
  documentId: string;
}

const { Text } = Typography;

export const DocumentLinkCopyer: React.FC<IProps> = ({
  wikiId,
  documentId,
}) => {
  const handle = useCallback(() => {
    copy(buildUrl(`/wiki/${wikiId}/document/${documentId}`));
  }, [wikiId, documentId]);

  return (
    <Text onClick={handle} style={{ cursor: "pointer" }}>
      <Space>
        <IconLink />
        复制链接
      </Space>
    </Text>
  );
};
