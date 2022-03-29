import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Button, Modal, Input, Typography, Toast, Layout, Nav } from '@douyinfe/semi-ui';
import { useEditor, EditorContent } from '@tiptap/react';

import { IconLink } from '@douyinfe/semi-icons';
import { isPublicDocument } from '@think/domains';
import { DEFAULT_EXTENSION, DocumentWithTitle } from 'tiptap';
import { safeJSONParse } from 'helpers/json';
import { ShareIllustration } from 'illustrations/share';
import { DataRender } from 'components/data-render';
import { useToggle } from 'hooks/use-toggle';
import { useDocumentVersion } from 'data/document';

interface IProps {
  documentId: string;
}

const { Text } = Typography;
const { Header, Footer, Sider, Content } = Layout;

export const DocumentVersion: React.FC<IProps> = ({ documentId }) => {
  const [visible, toggleVisible] = useToggle(false);
  const { data, loading, error, refresh } = useDocumentVersion(documentId);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const editor = useEditor({
    editable: false,
    extensions: [...DEFAULT_EXTENSION, DocumentWithTitle],
    content: {},
  });

  const select = useCallback(
    (version) => {
      setSelectedVersion(version);
      editor.commands.setContent(safeJSONParse(version.data, { default: {} }).default);
    },
    [editor]
  );

  useEffect(() => {
    if (visible) {
      refresh();
    }
  }, [visible]);

  return (
    <>
      <Button type="primary" theme="light" onClick={toggleVisible}>
        文档版本
      </Button>
      <Modal
        title="历史记录"
        fullScreen
        visible={visible}
        onOk={() => toggleVisible(false)}
        onCancel={() => toggleVisible(false)}
      >
        <Layout style={{ height: 'calc(100vh - 72px)', overflow: 'hidden' }}>
          <Sider>
            <Nav
              bodyStyle={{ height: 'calc(100vh - 96px)', overflow: 'auto' }}
              defaultOpenKeys={['job']}
              items={data.map(({ version, data }) => {
                return { itemKey: version, text: version, onClick: () => select({ version, data }) };
              })}
            />
          </Sider>
          <Content>
            <Layout className="components-layout-demo">
              <Header>Header</Header>
              <Content>
                <div className="container" style={{ paddingBottom: 48 }}>
                  <EditorContent editor={editor} />
                </div>
              </Content>
            </Layout>
          </Content>
        </Layout>
      </Modal>
    </>
  );
};
