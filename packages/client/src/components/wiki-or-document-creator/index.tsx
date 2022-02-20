import React from "react";
import { Dropdown, Button } from "@douyinfe/semi-ui";
import { IconChevronDown } from "@douyinfe/semi-icons";
import { useToggle } from "hooks/useToggle";
import { useQuery } from "hooks/useQuery";
import { WikiCreator } from "components/wiki/create";
import { DocumentCreator } from "components/document/create";

interface IProps {
  onCreateDocument?: () => void;
}

export const WikiOrDocumentCreator: React.FC<IProps> = ({
  onCreateDocument,
  children,
}) => {
  const { wikiId, docId } = useQuery<{ wikiId?: string; docId?: string }>();
  const [visible, toggleVisible] = useToggle(false);
  const [createDocumentModalVisible, toggleCreateDocumentModalVisible] =
    useToggle(false);

  return (
    <>
      <Dropdown
        render={
          <Dropdown.Menu>
            <Dropdown.Item onClick={toggleVisible}>知识库</Dropdown.Item>
            {wikiId && (
              <Dropdown.Item onClick={toggleCreateDocumentModalVisible}>
                文档
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        }
      >
        {children || (
          <Button
            type="primary"
            theme="solid"
            icon={<IconChevronDown />}
            iconPosition="right"
          >
            新建
          </Button>
        )}
      </Dropdown>
      <WikiCreator visible={visible} toggleVisible={toggleVisible} />
      {wikiId && (
        <DocumentCreator
          wikiId={wikiId}
          parentDocumentId={docId}
          visible={createDocumentModalVisible}
          toggleVisible={toggleCreateDocumentModalVisible}
          onCreate={onCreateDocument}
        />
      )}
    </>
  );
};
