import React from 'react';
import { Button } from '@douyinfe/semi-ui';
import { useToggle } from 'hooks/use-toggle';
import { useQuery } from 'hooks/use-query';
import { DocumentCreator as DocumenCreatorForm } from 'components/document/create';

interface IProps {
  onCreateDocument?: () => void;
}

export const DocumentCreator: React.FC<IProps> = ({ onCreateDocument, children }) => {
  const { wikiId, docId } = useQuery<{ wikiId?: string; docId?: string }>();
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
          parentDocumentId={docId}
          visible={visible}
          toggleVisible={toggleVisible}
          onCreate={onCreateDocument}
        />
      )}
    </>
  );
};
