import { IconLink } from '@douyinfe/semi-icons';
import { Space, Typography } from '@douyinfe/semi-ui';
import { copy } from 'helpers/copy';
import { buildUrl } from 'helpers/url';
import React, { useCallback } from 'react';

interface IProps {
  wikiId: string;
  documentId: string;
  render?: (arg: { copy: () => void; children: React.ReactNode }) => React.ReactNode;
}

const { Text } = Typography;

export const DocumentLinkCopyer: React.FC<IProps> = ({ wikiId, documentId, render }) => {
  const handle = useCallback(() => {
    copy(buildUrl(`/wiki/${wikiId}/document/${documentId}`));
  }, [wikiId, documentId]);

  const content = (
    <Space>
      <IconLink />
      复制链接
    </Space>
  );

  return render ? (
    <>{render({ copy: handle, children: content })}</>
  ) : (
    <Text onClick={handle} style={{ cursor: 'pointer' }}>
      {content}
    </Text>
  );
};
