import { NodeViewWrapper } from '@tiptap/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import cls from 'classnames';
import { Typography } from '@douyinfe/semi-ui';
import { useChildrenDocument } from 'data/document';
import { DataRender } from 'components/data-render';
import { Empty } from 'components/empty';
import { IconDocument } from 'components/icons';
import styles from './index.module.scss';
import { useEffect } from 'react';

const { Text } = Typography;

export const DocumentChildrenWrapper = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { pathname, query } = useRouter();
  let { wikiId, documentId } = node.attrs;
  if (!wikiId) {
    wikiId = query?.wikiId;
  }
  if (!documentId) {
    documentId = query?.documentId;
  }
  const isShare = pathname.includes('share');
  const { data: documents, loading, error } = useChildrenDocument({ wikiId, documentId, isShare });

  useEffect(() => {
    const attrs = node.attrs;

    if (attrs.wikiId !== wikiId || attrs.documentId !== documentId) {
      updateAttributes({ wikiId, documentId });
    }
  }, [node.attrs, wikiId, documentId, updateAttributes]);

  return (
    <NodeViewWrapper
      as="div"
      className={cls('render-wrapper', styles.wrap, isEditable && styles.isEditable, 'documentChildren')}
    >
      <div>
        <div>
          <Text type="tertiary">子文档</Text>
        </div>
        {wikiId || documentId ? (
          <DataRender
            loading={loading}
            error={error}
            normalContent={() => {
              if (!documents || !documents.length) {
                return <Empty message="暂无子文档" />;
              }
              return (
                <div>
                  {documents.map((doc) => {
                    return (
                      <Link
                        key={doc.id}
                        href={{
                          pathname: `${!isShare ? '' : '/share'}/wiki/[wikiId]/document/[documentId]`,
                          query: { wikiId: doc.wikiId, documentId: doc.id },
                        }}
                      >
                        <a className={styles.itemWrap} target="_blank">
                          <IconDocument />
                          <span>{doc.title}</span>
                        </a>
                      </Link>
                    );
                  })}
                </div>
              );
            }}
          />
        ) : (
          <Text type="tertiary">当前页面无法使用子文档</Text>
        )}
      </div>
    </NodeViewWrapper>
  );
};
