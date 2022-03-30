import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, Typography } from '@douyinfe/semi-ui';
import { IconClose } from '@douyinfe/semi-icons';
import { useEditor, EditorContent } from '@tiptap/react';
import cls from 'classnames';
import { DEFAULT_EXTENSION, DocumentWithTitle } from 'tiptap';
import { safeJSONParse } from 'helpers/json';
import { DataRender } from 'components/data-render';
import { useToggle } from 'hooks/use-toggle';
import { useDocumentVersion } from 'data/document';
import styles from './index.module.scss';

interface IProps {
  documentId: string;
  onSelect?: (data) => void;
}

const { Title } = Typography;

export const DocumentVersion: React.FC<IProps> = ({ documentId, onSelect }) => {
  const [visible, toggleVisible] = useToggle(false);
  const { data, loading, error, refresh } = useDocumentVersion(documentId);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const editor = useEditor({
    editable: false,
    extensions: [...DEFAULT_EXTENSION, DocumentWithTitle],
    content: {},
  });

  const close = useCallback(() => {
    toggleVisible(false);
    setSelectedVersion(null);
  }, []);

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
  }, [selectedVersion]);

  useEffect(() => {
    if (visible) {
      refresh();
    }
  }, [visible]);

  useEffect(() => {
    if (!editor) return;
    if (!data.length) return;
    if (selectedVersion) return;
    select(data[0]);
  }, [editor, data, selectedVersion]);

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
              <Button icon={<IconClose />} onClick={close} />
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
          normalContent={() => (
            <div className={styles.contentWrap}>
              <aside>
                <ul>
                  {data.map(({ version, data }) => {
                    return (
                      <li
                        key={version}
                        className={cls(selectedVersion && selectedVersion.version === version && styles.selected)}
                        onClick={() => select({ version, data })}
                      >
                        {version}
                      </li>
                    );
                  })}
                </ul>
              </aside>
              <main>
                <div className={cls('container', styles.editorWrap)}>
                  <EditorContent editor={editor} />
                </div>
              </main>
            </div>
          )}
        />
      </Modal>
    </>
  );
};
