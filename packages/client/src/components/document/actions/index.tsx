import React, { useCallback } from "react";
import { Dropdown, Button, Typography, Space } from "@douyinfe/semi-ui";
import { IconMore, IconStar, IconPlus } from "@douyinfe/semi-icons";
import { DocumentLinkCopyer } from "components/document/link";
import { DocumentDeletor } from "components/document/delete";
import { DocumentCreator } from "components/document/create";
import { DocumentStar } from "components/document/star";
import { useToggle } from "hooks/useToggle";

interface IProps {
  wikiId: string;
  documentId: string;
  onStar?: () => void;
  onCreate?: () => void;
  onDelete?: () => void;
  onVisibleChange?: () => void;
  showCreateDocument?: boolean;
}

const { Text } = Typography;

export const DocumentActions: React.FC<IProps> = ({
  wikiId,
  documentId,
  onStar,
  onCreate,
  onDelete,
  onVisibleChange,
  showCreateDocument,
  children,
}) => {
  const [visible, toggleVisible] = useToggle(false);

  const prevent = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <>
      <Dropdown
        onVisibleChange={onVisibleChange}
        render={
          <Dropdown.Menu>
            {showCreateDocument && (
              <Dropdown.Item onClick={prevent}>
                <Text onClick={toggleVisible}>
                  <Space>
                    <IconPlus />
                    新建子文档
                  </Space>
                </Text>
              </Dropdown.Item>
            )}
            <Dropdown.Item onClick={prevent}>
              <DocumentStar
                documentId={documentId}
                render={({ star, toggleStar, text }) => (
                  <Text
                    onClick={() => {
                      toggleStar().then(onStar);
                    }}
                  >
                    <Space>
                      <IconStar
                        style={{
                          color: star
                            ? "rgba(var(--semi-amber-4), 1)"
                            : "rgba(var(--semi-grey-3), 1)",
                        }}
                      />
                      {text}
                    </Space>
                  </Text>
                )}
              />
            </Dropdown.Item>
            <Dropdown.Item onClick={prevent}>
              <DocumentLinkCopyer wikiId={wikiId} documentId={documentId} />
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={prevent}>
              <DocumentDeletor
                wikiId={wikiId}
                documentId={documentId}
                onDelete={onDelete}
              />
            </Dropdown.Item>
          </Dropdown.Menu>
        }
      >
        {children || (
          <Button
            onClick={prevent}
            icon={<IconMore />}
            theme="borderless"
            type="tertiary"
          />
        )}
      </Dropdown>
      {showCreateDocument && (
        <DocumentCreator
          wikiId={wikiId}
          parentDocumentId={documentId}
          visible={visible}
          toggleVisible={toggleVisible}
          onCreate={onCreate}
        />
      )}
    </>
  );
};
