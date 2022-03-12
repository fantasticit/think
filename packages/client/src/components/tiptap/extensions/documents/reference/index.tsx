import { Node, Command, mergeAttributes, wrappingInputRule } from '@tiptap/core';
import { NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from '@tiptap/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Select } from '@douyinfe/semi-ui';
import { useWikiTocs } from 'data/wiki';
import { DataRender } from 'components/data-render';
import { IconDocument } from 'components/icons';
import styles from './index.module.scss';

declare module '@tiptap/core' {
  interface Commands {
    documentReference: {
      setDocumentReference: () => Command;
    };
  }
}

export const DocumentReferenceInputRegex = /^documentReference\$$/;

const DocumentReferenceExtension = Node.create({
  name: 'documentReference',
  group: 'block',
  defining: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      wikiId: {
        default: '',
      },
      documentId: {
        default: '',
      },
      title: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type=documentReference]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes((this.options && this.options.HTMLAttributes) || {}, HTMLAttributes),
    ];
  },

  // @ts-ignore
  addCommands() {
    return {
      setDocumentReference:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {},
          });
        },
    };
  },

  addInputRules() {
    return [
      wrappingInputRule({
        find: DocumentReferenceInputRegex,
        type: this.type,
      }),
    ];
  },
});

const Render = ({ editor, node, updateAttributes }) => {
  const { pathname, query } = useRouter();
  const wikiIdFromUrl = query?.wikiId;
  const isShare = pathname.includes('share');
  const isEditable = editor.isEditable;
  const { wikiId, documentId, title } = node.attrs;
  const { data: tocs, loading, error } = useWikiTocs(isShare ? null : wikiIdFromUrl);

  const selectDoc = (str) => {
    const [wikiId, documentId, title] = str.split('/');
    updateAttributes({ wikiId, documentId, title });
  };

  return (
    <NodeViewWrapper as="div" className={styles.wrap}>
      <div>
        {isEditable && (
          <DataRender
            loading={loading}
            error={error}
            normalContent={() => (
              <Select
                placeholder="请选择文档"
                onChange={(v) => selectDoc(v)}
                {...(wikiId && documentId ? { value: `${wikiId}/${documentId}/${title}` } : {})}
              >
                {(tocs || []).map((toc) => (
                  <Select.Option
                    label={`${toc.id}/${toc.title}`}
                    value={`${toc.wikiId}/${toc.id}/${toc.title}`}
                  >
                    {toc.title}
                  </Select.Option>
                ))}
              </Select>
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

export const DocumentReference = DocumentReferenceExtension.extend({
  addNodeView() {
    return ReactNodeViewRenderer(Render);
  },
});
