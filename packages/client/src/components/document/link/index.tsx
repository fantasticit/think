import { IconLink } from '@douyinfe/semi-icons';
import { Space, Typography } from '@douyinfe/semi-ui';
import { IDocument, IOrganization, IWiki } from '@think/domains';
import { copy } from 'helpers/copy';
import { buildUrl } from 'helpers/url';
import React, { useCallback } from 'react';

interface IProps {
  organizationId: IOrganization['id'];
  wikiId: IWiki['id'];
  documentId: IDocument['id'];
  render?: (arg: { copy: () => void; children: React.ReactNode }) => React.ReactNode;
}

const { Text } = Typography;

const style = { cursor: 'pointer' };

export const DocumentLinkCopyer: React.FC<IProps> = ({ organizationId, wikiId, documentId, render }) => {
  const handle = useCallback(() => {
    copy(buildUrl(`/app/org/${organizationId}/wiki/${wikiId}/doc/${documentId}`));
  }, [organizationId, wikiId, documentId]);

  const content = (
    <Space>
      <IconLink />
      复制链接
    </Space>
  );

  return render ? (
    <>{render({ copy: handle, children: content })}</>
  ) : (
    <Text onClick={handle} style={style}>
      {content}
    </Text>
  );
};
