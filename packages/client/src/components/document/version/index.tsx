import { IconChevronLeft } from '@douyinfe/semi-icons';
import { Button, Modal, Select, Space, Tag, Typography } from '@douyinfe/semi-ui';
import { EditorContent, useEditor } from '@tiptap/react';
import cls from 'classnames';
import { DataRender } from 'components/data-render';
import { LocaleTime } from 'components/locale-time';
import { useDocumentVersion } from 'data/document';
import { generateDiffHtml } from 'helpers/generate-html';
import { safeJSONParse } from 'helpers/json';
import { DocumentVersionControl } from 'hooks/use-document-version';
import { IsOnMobile } from 'hooks/use-on-mobile';
import React, { useCallback, useEffect, useState } from 'react';
import { CollaborationKit } from 'tiptap/editor';

import styles from './index.module.scss';

export interface IProps {
  documentId: string;
  disabled?: boolean;
  onSelect?: (data) => void;
  render?: (arg: { onClick: (arg?: any) => void; disabled: boolean }) => React.ReactNode;
}

const { Title, Text } = Typography;

export const DocumentVersion: React.FC<Partial<IProps>> = ({ documentId, onSelect }) => {
  const { isMobile } = IsOnMobile.useHook();

  const { visible, toggleVisible } = DocumentVersionControl.useHook();
  const { data, loading, error, refresh } = useDocumentVersion(documentId, { enabled: visible });
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [diffVersion, setDiffVersion] = useState(null);

  const editor = useEditor(
    {
      editable: false,
      editorProps: {
        attributes: {
          class: 'is-editable',
        },
      },
      extensions: CollaborationKit,
      content: { type: 'doc', content: [] },
    },
    []
  );

  const close = useCallback(() => {
    toggleVisible(false);
    setSelectedVersion(null);
  }, [toggleVisible]);

  const select = useCallback(
    (version) => {
      setDiffVersion(null);
      setSelectedVersion(version);
      editor.commands.setContent(safeJSONParse(version.data, { default: {} }).default);
    },
    [editor, setDiffVersion]
  );

  const changeDiffVision = useCallback(
    (version) => {
      setDiffVersion(version);
    },
    [setDiffVersion]
  );

  const restore = useCallback(() => {
    if (!selectedVersion || !onSelect) return;
    onSelect(safeJSONParse(selectedVersion.data, { default: {} }).default);
    close();
  }, [selectedVersion, close, onSelect]);

  useEffect(() => {
    if (diffVersion && selectedVersion) {
      const historyVersion = data.find((item) => item.version === diffVersion);

      const diffHtml = generateDiffHtml(
        safeJSONParse(selectedVersion.data, { default: {} }).default,
        safeJSONParse(historyVersion.data, { default: {} }).default
      );

      const element = document.getElementById('diff-visual');
      element.innerHTML = diffHtml;
    }
  }, [diffVersion, data, selectedVersion]);

  useEffect(() => {
    if (!editor) return;
    if (!data.length) return;
    if (selectedVersion) return;
    select(data[0]);
  }, [editor, data, selectedVersion, select]);

  return (
    <>
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
            {selectedVersion && !isMobile && (
              <div>
                <Tag color="light-blue" style={{ padding: '12px 14px', fontSize: '14px' }}>
                  {new Date(+selectedVersion.version).toLocaleString()}
                </Tag>
                <div style={{ padding: '0 8px' }}>与</div>
                <Select placeholder="请选择历史" size="small" onChange={changeDiffVision} value={diffVersion} showClear>
                  {data.map(({ version }) => {
                    return (
                      <Select.Option value={version} key={version} disabled={version === selectedVersion.version}>
                        {new Date(+version).toLocaleString()}
                      </Select.Option>
                    );
                  })}
                </Select>
                <div style={{ paddingLeft: '8px' }}>对比</div>
                <Space style={{ marginLeft: 12 }}>
                  <Tag style={{ backgroundColor: '#e9ffe9', color: '#333' }}>增加的内容</Tag>
                  <Tag style={{ backgroundColor: '#ffeaea', color: '#333' }}>删除的内容</Tag>
                </Space>
              </div>
            )}
            <div>
              <Button
                theme="light"
                type="primary"
                style={{ marginRight: 8 }}
                disabled={loading || !!error}
                loading={loading}
                onClick={refresh}
              >
                刷新
              </Button>
              <Button type="primary" theme="solid" disabled={!onSelect || !selectedVersion} onClick={restore}>
                恢复此记录
              </Button>
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
            <div className={styles.contentWrap}>
              <main className={cls(isMobile && styles.isMobile)}>
                <div className="container">
                  {diffVersion ? (
                    <div id="diff-visual" className="ProseMirror"></div>
                  ) : (
                    <EditorContent editor={editor} />
                  )}
                </div>
              </main>
              <aside className={cls(isMobile && styles.isMobile)}>
                {data.map(({ version, data, createUser }) => {
                  return (
                    <div
                      key={version}
                      className={cls(
                        styles.item,
                        isMobile && styles.isMobile,
                        selectedVersion && selectedVersion.version === version && styles.selected
                      )}
                      onClick={() => select({ version, data })}
                    >
                      <p>
                        <LocaleTime date={+version} />
                      </p>
                      <p>
                        <Text>{createUser && createUser.name}</Text>
                      </p>
                    </div>
                  );
                })}
              </aside>
            </div>
          )}
        />
      </Modal>
    </>
  );
};

export const DocumentVersionTrigger: React.FC<Partial<IProps>> = ({ render, disabled }) => {
  const { toggleVisible } = DocumentVersionControl.useHook();

  return (
    <>
      {render ? (
        render({ onClick: toggleVisible, disabled })
      ) : (
        <>
          <Button type="primary" theme="light" disabled={disabled} onClick={toggleVisible}>
            历史记录
          </Button>
        </>
      )}
    </>
  );
};
