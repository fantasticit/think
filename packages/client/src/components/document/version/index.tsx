import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, Typography, Layout, Nav } from '@douyinfe/semi-ui';
import { IconChevronLeft } from '@douyinfe/semi-icons';
import { useEditor, EditorContent } from '@tiptap/react';
import cls from 'classnames';
import { CollaborationKit } from 'tiptap/editor';
import { safeJSONParse } from 'helpers/json';
import { DataRender } from 'components/data-render';
import { LocaleTime } from 'components/locale-time';
import { useToggle } from 'hooks/use-toggle';
import { useDocumentVersion } from 'data/document';
import styles from './index.module.scss';

interface IProps {
  documentId: string;
  onSelect?: (data) => void;
}

const { Sider, Content } = Layout;
const { Title } = Typography;

export const DocumentVersion: React.FC<IProps> = ({ documentId, onSelect }) => {
  const [visible, toggleVisible] = useToggle(false);
  const { data, loading, error, refresh } = useDocumentVersion(documentId);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const editor = useEditor({
    editable: false,
    extensions: CollaborationKit,
    content: { type: 'doc', content: [] },
  });

  const close = useCallback(() => {
    toggleVisible(false);
    setSelectedVersion(null);
  }, [toggleVisible]);

  const select = useCallback(
    (version) => {
      setSelectedVersion(version);
      editor.commands.setContent(safeJSONParse(version.data, { default: {} }).default);
    },
    [editor]
  );

  const restore = useCallback(() => {
    if (!selectedVersion || !onSelect) return;
    onSelect(safeJSONParse(selectedVersion.data, { default: {} }).default);
    close();
  }, [selectedVersion, close, onSelect]);

  useEffect(() => {
    if (visible) {
      refresh();
    }
  }, [visible, refresh]);

  useEffect(() => {
    if (!editor) return;
    if (!data.length) return;
    if (selectedVersion) return;
    select(data[0]);
  }, [editor, data, selectedVersion, select]);

  return (
    <>
      <Button type="primary" theme="light" onClick={toggleVisible}>
        文档版本
      </Button>
      <Modal
        title="历史记录"
        fullScreen
        visible={visible}
        style={{ padding: 0 }}
        bodyStyle={{ padding: 0 }}
        header={
          <div className={styles.headerWrap}>
            <div>
              <Button theme="borderless" icon={<IconChevronLeft />} onClick={close} />
              <Title heading={5} style={{ marginLeft: 12 }}>
                版本记录
              </Title>
            </div>
            <div>
              <Button
                theme="light"
                type="primary"
                style={{ marginRight: 8 }}
                disabled={loading || error}
                onClick={() => refresh()}
              >
                刷新
              </Button>
              {onSelect && (
                <Button type="primary" theme="solid" disabled={!selectedVersion} onClick={restore}>
                  恢复此记录
                </Button>
              )}
            </div>
          </div>
        }
        footer={null}
      >
        <DataRender
          loading={loading}
          error={error}
          empty={!loading && !data.length}
          normalContent={() => (
            <Layout className={styles.contentWrap}>
              <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
                <Nav
                  style={{ maxWidth: 200, height: '100%' }}
                  bodyStyle={{ height: '100%' }}
                  selectedKeys={[selectedVersion]}
                  footer={{
                    collapseButton: true,
                  }}
                >
                  {data.map(({ version, data }) => {
                    return (
                      <Nav.Item
                        key={version}
                        itemKey={version}
                        className={cls(selectedVersion && selectedVersion.version === version && styles.selected)}
                        text={<LocaleTime date={+version} />}
                        onClick={() => select({ version, data })}
                      />
                    );
                  })}
                </Nav>
              </Sider>
              <Content
                style={{
                  padding: 16,
                  backgroundColor: 'var(--semi-color-bg-0)',
                }}
              >
                <div className={'container'}>
                  <EditorContent editor={editor} />
                </div>
              </Content>
            </Layout>
          )}
        />
      </Modal>
    </>
  );
};
