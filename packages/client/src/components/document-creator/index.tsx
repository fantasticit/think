import { Button } from '@douyinfe/semi-ui';
import { DocumentCreator as DocumenCreatorForm } from 'components/document/create';
import { useRouterQuery } from 'hooks/use-router-query';
import { useToggle } from 'hooks/use-toggle';
import React from 'react';

interface IProps {
  onCreateDocument?: () => void;
}

export const DocumentCreator: React.FC<IProps> = ({ onCreateDocument, children }) => {
  const { wikiId, documentId } = useRouterQuery<{ wikiId?: string; documentId?: string }>();
  const [visible, toggleVisible] = useToggle(false);

  return (
    <>
      {children || (
        <Button type="primary" theme="solid" onClick={toggleVisible}>
          新建文档
        </Button>
      )}
      {wikiId && (
        <DocumenCreatorForm
          wikiId={wikiId}
          parentDocumentId={documentId}
          visible={visible}
          toggleVisible={toggleVisible}
          onCreate={onCreateDocument}
        />
      )}
    </>
  );
};
