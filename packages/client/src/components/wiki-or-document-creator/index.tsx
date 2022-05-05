import React from 'react';
import { Dropdown, Button } from '@douyinfe/semi-ui';
import { IconChevronDown, IconPlus } from '@douyinfe/semi-icons';
import { useWindowSize } from 'hooks/use-window-size';
import { useToggle } from 'hooks/use-toggle';
import { useQuery } from 'hooks/use-query';
import { WikiCreator } from 'components/wiki/create';
import { DocumentCreator } from 'components/document/create';

interface IProps {
  onCreateDocument?: () => void;
}

export const WikiOrDocumentCreator: React.FC<IProps> = ({ onCreateDocument, children }) => {
  const { isMobile } = useWindowSize();
  const { wikiId, docId } = useQuery<{ wikiId?: string; docId?: string }>();
  const [dropdownVisible, toggleDropdownVisible] = useToggle(false);
  const [visible, toggleVisible] = useToggle(false);
  const [createDocumentModalVisible, toggleCreateDocumentModalVisible] = useToggle(false);

  return (
    <>
      <Dropdown
        trigger="click"
        visible={dropdownVisible}
        onVisibleChange={toggleDropdownVisible}
        render={
          // @ts-ignore
          <Dropdown.Menu onClick={toggleDropdownVisible}>
            <Dropdown.Item onClick={toggleVisible}>知识库</Dropdown.Item>
            {wikiId && <Dropdown.Item onClick={toggleCreateDocumentModalVisible}>文档</Dropdown.Item>}
          </Dropdown.Menu>
        }
      >
        <span onClick={toggleDropdownVisible}>
          {children || <Button type="primary" theme="solid" icon={<IconPlus />} size="small" />}
        </span>
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
