import React, { useMemo } from 'react';
import cls from 'classnames';
import { useEditor, EditorContent } from '@tiptap/react';
import { Layout, Spin, Typography } from '@douyinfe/semi-ui';
import { IUser, ITemplate } from '@think/domains';
import { DEFAULT_EXTENSION, DocumentWithTitle } from 'tiptap';
import { DataRender } from 'components/data-render';
import { ImageViewer } from 'components/image-viewer';
import { useDocumentStyle } from 'hooks/use-document-style';
import { safeJSONParse } from 'helpers/json';
import styles from './index.module.scss';

const { Content } = Layout;
const { Title } = Typography;

interface IProps {
  user: IUser;
  data: ITemplate;
  loading: boolean;
  error: Error | null;
}

export const Editor: React.FC<IProps> = ({ user, data, loading, error }) => {
  if (!user) return null;

  const c = safeJSONParse(data.content);
  let json = c.default || c;

  if (json && json.content) {
    json = {
      type: 'doc',
      content: json.content.slice(1),
    };
  }

  const editor = useEditor({
    editable: false,
    extensions: [...DEFAULT_EXTENSION, DocumentWithTitle],
    content: json,
  });

  const { width, fontSize } = useDocumentStyle();
  const editorWrapClassNames = useMemo(() => {
    return width === 'standardWidth' ? styles.isStandardWidth : styles.isFullWidth;
  }, [width]);

  return (
    <div className={styles.wrap}>
      <Layout className={styles.contentWrap}>
        <DataRender
          loading={false}
          loadingContent={
            <div style={{ margin: 24 }}>
              <Spin></Spin>
            </div>
          }
          error={error}
          normalContent={() => {
            return (
              <Content className={cls(styles.editorWrap)}>
                <div className={editorWrapClassNames} style={{ fontSize }}>
                  <Title>{data.title}</Title>
                  <EditorContent editor={editor} />
                </div>
                <ImageViewer containerSelector={`.${styles.editorWrap}`} />
              </Content>
            );
          }}
        />
      </Layout>
    </div>
  );
};
