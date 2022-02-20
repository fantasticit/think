import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import Router from "next/router";
import { Modal, Tabs, TabPane, Checkbox } from "@douyinfe/semi-ui";
import { useCreateDocument } from "data/document";
import { usePublicTemplates, useOwnTemplates } from "data/template";
import { TemplateList } from "components/template/list";
import { TemplateCardEmpty } from "components/template/card";

import styles from "./index.module.scss";

interface IProps {
  wikiId: string;
  parentDocumentId?: string;
  visible: boolean;
  toggleVisible: Dispatch<SetStateAction<boolean>>;
  onCreate?: () => void;
}

export const DocumentCreator: React.FC<IProps> = ({
  wikiId,
  parentDocumentId,
  visible,
  toggleVisible,
  onCreate,
}) => {
  const { loading, create } = useCreateDocument();
  const [createChildDoc, setCreateChildDoc] = useState(false);
  const [templateId, setTemplateId] = useState("");

  const handleOk = () => {
    const data = {
      wikiId,
      parentDocumentId: createChildDoc ? parentDocumentId : null,
      templateId,
    };
    create(data).then((res) => {
      toggleVisible(false);
      onCreate && onCreate();
      setTemplateId("");
      Router.push({
        pathname: `/wiki/${wikiId}/document/${res.id}/edit`,
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
        maxWidth: "96vw",
        width: "calc(100vh - 120px)",
      }}
      bodyStyle={{
        maxHeight: "calc(90vh - 120px)",
        overflow: "auto",
      }}
      key={wikiId}
    >
      <Tabs
        type="button"
        tabBarExtraContent={
          parentDocumentId && (
            <Checkbox
              checked={createChildDoc}
              onChange={(e) => setCreateChildDoc(e.target.checked)}
            >
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
                onClick={() => setTemplateId("")}
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
                onClick={() => setTemplateId("")}
              />
            }
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
};
