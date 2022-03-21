import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import cls from 'classnames';
import Select from 'react-select';
import { useWikiTocs } from 'data/wiki';
import { DataRender } from 'components/data-render';
import { IconDocument } from 'components/icons';
import styles from './index.module.scss';

export const DocumentReferenceWrapper = ({ editor, node, updateAttributes }) => {
  const { pathname, query } = useRouter();
  const wikiIdFromUrl = query?.wikiId;
  const isShare = pathname.includes('share');
  const isEditable = editor.isEditable;
  const { wikiId, documentId, title } = node.attrs;
  const { data: tocs, loading, error } = useWikiTocs(isShare ? null : wikiIdFromUrl);

  const selectDoc = (toc) => {
    const { wikiId, documentId, title } = toc.value;
    updateAttributes({ wikiId, documentId, title });
  };

  return (
    <NodeViewWrapper as="div" className={cls(styles.wrap, isEditable && styles.isEditable)}>
      <div>
        {isEditable && (
          <DataRender
            loading={loading}
            error={error}
            normalContent={() => (
              <Select
                className="react-select"
                placeholder="请选择文档"
                value={{ label: title, value: { wikiId, documentId, title } }}
                onChange={selectDoc}
                options={tocs.map((toc) => ({
                  label: toc.title,
                  value: { title: toc.title, wikiId: toc.wikiId, documentId: toc.id },
                }))}
              />
            )}
          />
        )}
        <Link
          key={documentId}
          href={{
            pathname: `${!isShare ? '' : '/share'}/wiki/[wikiId]/document/[documentId]`,
            query: { wikiId, documentId },
          }}
        >
          <a className={styles.itemWrap} target="_blank">
            <IconDocument />
            <span>{title || '请选择文档'}</span>
          </a>
        </Link>
      </div>
      <NodeViewContent></NodeViewContent>
    </NodeViewWrapper>
  );
};
