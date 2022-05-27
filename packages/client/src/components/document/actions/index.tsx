import { IconMore, IconPlus, IconStar } from '@douyinfe/semi-icons';
import { Button, Dropdown, Popover, Space, Typography } from '@douyinfe/semi-ui';
import { DocumentCreator } from 'components/document/create';
import { DocumentDeletor } from 'components/document/delete';
import { DocumentLinkCopyer } from 'components/document/link';
import { DocumentStar } from 'components/document/star';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback } from 'react';

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
  const [popoverVisible, togglePopoverVisible] = useToggle(false);
  const [createVisible, toggleCreateVisible] = useToggle(false);

  const create = useCallback(() => {
    togglePopoverVisible(false);
    toggleCreateVisible(true);
  }, [togglePopoverVisible, toggleCreateVisible]);

  const wrapedOnDelete = useCallback(() => {
    togglePopoverVisible(false);
    onDelete && onDelete();
  }, [onDelete, togglePopoverVisible]);

  const wrapOnVisibleChange = useCallback(
    (visible) => {
      togglePopoverVisible(visible);
      onVisibleChange && onVisibleChange();
    },
    [onVisibleChange, togglePopoverVisible]
  );

  return (
    <>
      <Popover
        showArrow
        style={{ padding: 0 }}
        trigger="click"
        visible={popoverVisible}
        onVisibleChange={wrapOnVisibleChange}
        content={
          <Dropdown.Menu>
            {showCreateDocument && (
              <Dropdown.Item onClick={create}>
                <Text>
                  <Space>
                    <IconPlus />
                    新建子文档
                  </Space>
                </Text>
              </Dropdown.Item>
            )}

            <DocumentStar
              documentId={documentId}
              render={({ star, toggleStar, text }) => (
                <Dropdown.Item
                  onClick={() => {
                    toggleStar().then(onStar);
                  }}
                >
                  <Text>
                    <Space>
                      <IconStar
                        style={{
                          color: star ? 'rgba(var(--semi-amber-4), 1)' : 'rgba(var(--semi-grey-3), 1)',
                        }}
                      />
                      {text}
                    </Space>
                  </Text>
                </Dropdown.Item>
              )}
            />

            <DocumentLinkCopyer
              wikiId={wikiId}
              documentId={documentId}
              render={({ copy, children }) => {
                return <Dropdown.Item onClick={copy}>{children}</Dropdown.Item>;
              }}
            />

            <Dropdown.Divider />

            <DocumentDeletor
              wikiId={wikiId}
              documentId={documentId}
              onDelete={wrapedOnDelete}
              render={({ children }) => {
                return <Dropdown.Item>{children}</Dropdown.Item>;
              }}
            />
          </Dropdown.Menu>
        }
      >
        {children || <Button icon={<IconMore />} theme="borderless" type="tertiary" />}
      </Popover>

      {showCreateDocument && (
        <DocumentCreator
          wikiId={wikiId}
          parentDocumentId={documentId}
          visible={createVisible}
          toggleVisible={toggleCreateVisible}
          onCreate={onCreate}
        />
      )}
    </>
  );
};
