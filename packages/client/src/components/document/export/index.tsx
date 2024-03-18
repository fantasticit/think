import React, { useCallback, useEffect, useMemo } from 'react';

import { Badge, Button, Dropdown, Modal, Space, Typography } from '@douyinfe/semi-ui';

import { IDocument } from '@think/domains';

import { createEditor } from 'tiptap/core';
import { AllExtensions } from 'tiptap/core/all-kit';
import { prosemirrorToMarkdown } from 'tiptap/markdown/prosemirror-to-markdown';

import { IconJSON, IconMarkdown, IconPDF, IconWord } from 'components/icons';
import { useDocumentDetail } from 'data/document';
import FileSaver from 'file-saver';
import { safeJSONParse, safeJSONStringify } from 'helpers/json';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { useToggle } from 'hooks/use-toggle';

import { printEditorContent } from './pdf';

import styles from './index.module.scss';

const { Text } = Typography;

interface IProps {
  document: IDocument;
  render?: (arg: { toggleVisible: (arg: boolean) => void }) => React.ReactNode;
}

export const DocumentExporter: React.FC<IProps> = ({ document, render }) => {
  const { isMobile } = IsOnMobile.useHook();
  const [visible, toggleVisible] = useToggle(false);
  const { exportDocx } = useDocumentDetail(document.id);

  const editor = useMemo(() => {
    return createEditor({
      editable: false,
      extensions: AllExtensions,
      content: '',
      editorProps: {
        // @ts-ignore
        print: true,
      },
    });
  }, []);

  const exportMarkdown = useCallback(() => {
    const md = prosemirrorToMarkdown({ content: editor.state.doc.slice(0).content });
    const blob = new Blob([md], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, `${document.title}.md`);
  }, [document, editor]);

  const exportJSON = useCallback(() => {
    const blob = new Blob([safeJSONStringify(editor.getJSON())], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, `${document.title}.json`);
  }, [document, editor]);

  const exportWord = useCallback(() => {
    const editorContent = editor.view.dom.closest('.ProseMirror');
    if (editorContent) {
      exportDocx(editorContent.outerHTML).then((res) => {
        const blob = new Blob([Buffer.from(res as Buffer)], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(blob, `${document.title}.docx`);
      });
    }
  }, [editor, exportDocx, document]);

  const exportPDF = useCallback(() => {
    printEditorContent(editor.view);
  }, [editor]);

  const content = useMemo(
    () => (
      <div
        style={{
          maxWidth: '96vw',
          overflow: 'auto',
          padding: '16px 0',
        }}
      >
        <Space>
          <div className={styles.templateItem} onMouseDown={exportMarkdown}>
            <header>
              <IconMarkdown style={{ fontSize: 40 }} />
            </header>
            <main>
              <Text>Markdown</Text>
            </main>
            <footer>
              <Text type="tertiary">.md</Text>
            </footer>
          </div>

          <div className={styles.templateItem} onMouseDown={exportJSON}>
            <header>
              <IconJSON style={{ fontSize: 40 }} />
            </header>
            <main>
              <Text>JSON</Text>
            </main>
            <footer>
              <Text type="tertiary">.json</Text>
            </footer>
          </div>

          <div className={styles.templateItem} onMouseDown={exportWord}>
            <header>
              <Badge count="beta" type="danger">
                <IconWord style={{ fontSize: 40 }} />
              </Badge>
            </header>
            <main>
              <Text>Word</Text>
            </main>
            <footer>
              <Text type="tertiary">.docx</Text>
            </footer>
          </div>

          <div className={styles.templateItem} onMouseDown={exportPDF}>
            <header>
              <Badge count="beta" type="danger">
                <IconPDF style={{ fontSize: 40 }} />
              </Badge>
            </header>
            <main>
              <Text>PDF</Text>
            </main>
            <footer>
              <Text type="tertiary">.pdf</Text>
            </footer>
          </div>
        </Space>
      </div>
    ),
    [exportMarkdown, exportJSON, exportWord, exportPDF]
  );

  const btn = useMemo(
    () =>
      render ? (
        render({ toggleVisible })
      ) : (
        <Button type="primary" theme="light" onClick={toggleVisible}>
          导出
        </Button>
      ),
    [render, toggleVisible]
  );

  useEffect(() => {
    const c = safeJSONParse(document && document.content);
    const json = c.default || c;
    editor.commands.setContent(json);
  }, [editor, document]);

  return (
    <>
      {isMobile ? (
        <>
          <Modal
            centered
            title="文档导出"
            visible={visible}
            footer={null}
            onCancel={toggleVisible}
            style={{ maxWidth: '96vw' }}
            zIndex={1061}
          >
            {content}
          </Modal>
          {btn}
        </>
      ) : (
        <Dropdown
          visible={visible}
          onVisibleChange={toggleVisible}
          trigger="custom"
          position="bottomRight"
          content={<div style={{ padding: '0 16px' }}>{content}</div>}
        >
          {btn}
        </Dropdown>
      )}
    </>
  );
};
