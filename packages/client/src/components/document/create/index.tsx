import { Checkbox, Modal, TabPane, Tabs } from '@douyinfe/semi-ui';
import { IDocument, IWiki } from '@think/domains';
import { TemplateCardEmpty } from 'components/template/card';
import { TemplateList } from 'components/template/list';
import { useCreateDocument } from 'data/document';
import { useOwnTemplates, usePublicTemplates } from 'data/template';
import { useRouterQuery } from 'hooks/use-router-query';
import Router from 'next/router';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

import styles from './index.module.scss';

interface IProps {
  wikiId: IWiki['id'];
  parentDocumentId?: IDocument['id'];
  visible: boolean;
  toggleVisible: Dispatch<SetStateAction<boolean>>;
  onCreate?: () => void;
}

export const DocumentCreator: React.FC<IProps> = ({ parentDocumentId, wikiId, visible, toggleVisible, onCreate }) => {
  const { organizationId } = useRouterQuery<{ organizationId?: string }>();
  const { loading, create } = useCreateDocument();
  const [createChildDoc, setCreateChildDoc] = useState(false);
  const [templateId, setTemplateId] = useState('');

  const handleOk = () => {
    const data = {
      organizationId,
      wikiId,
      parentDocumentId: createChildDoc ? parentDocumentId : null,
      templateId,
    };
    create(data).then((res) => {
      toggleVisible(false);
      onCreate && onCreate();
      setTemplateId('');
      Router.push({
        pathname: `/app/org/[organizationId]/wiki/[wikiId]/doc/[documentId]/edit`,
        query: { organizationId, wikiId, documentId: res.id },
      });
    });
  };
  const handleCancel = useCallback(() => {
    toggleVisible(false);
  }, [toggleVisible]);

  useEffect(() => {
    setCreateChildDoc(!!parentDocumentId);
  }, [parentDocumentId]);

  return (
    <Modal
      title="模板库"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ loading }}
      style={{
        maxWidth: '96vw',
        width: '96vh',
      }}
      bodyStyle={{
        maxHeight: 'calc(80vh - 150px)',
        overflow: 'auto',
      }}
      key={wikiId}
    >
      <Tabs
        type="button"
        tabBarExtraContent={
          parentDocumentId && (
            <Checkbox checked={createChildDoc} onChange={(e) => setCreateChildDoc(e.target.checked)}>
              为该文档创建子文档
            </Checkbox>
          )
        }
      >
        <TabPane tab="公开模板" itemKey="all">
          <TemplateList
            hook={usePublicTemplates}
            onClick={(id) => setTemplateId(id)}
            getClassNames={(id) => id === templateId && styles.isActive}
            firstListItem={
              <TemplateCardEmpty
                getClassNames={() => !templateId && styles.isActive}
                onClick={() => setTemplateId('')}
              />
            }
          />
        </TabPane>
        <TabPane tab="我创建的" itemKey="own">
          <TemplateList
            hook={useOwnTemplates}
            onClick={(id) => setTemplateId(id)}
            getClassNames={(id) => id === templateId && styles.isActive}
            firstListItem={
              <TemplateCardEmpty
                getClassNames={() => !templateId && styles.isActive}
                onClick={() => setTemplateId('')}
              />
            }
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
};
