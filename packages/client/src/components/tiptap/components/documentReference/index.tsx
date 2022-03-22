import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import cls from 'classnames';
import { Select } from '@douyinfe/semi-ui';
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

  const selectDoc = (str) => {
    const [wikiId, title, documentId] = str.split('/');
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
                placeholder="请选择文档"
                onChange={(v) => selectDoc(v)}
                {...(wikiId && documentId ? { value: `${wikiId}/${title}/${documentId}` } : {})}
              >
                {(tocs || []).map((toc) => (
                  <Select.Option
                    // FIXME: semi-design 抄 antd，抄的什么玩意！！！
                    label={`${toc.title}/${toc.id}`}
                    value={`${toc.wikiId}/${toc.title}/${toc.id}`}
                  >
                    {toc.title}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        )}
        {wikiId && documentId ? (
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
        ) : (
          <div className={styles.empty}>
            <span>{'用户未选择文档'}</span>
          </div>
        )}
      </div>
      <NodeViewContent></NodeViewContent>
    </NodeViewWrapper>
  );
};
